require("dotenv").config();

const express = require("express");
const { createClient } = require("redis");

const app = express();
const port = Number(process.env.PORT || 3000);
const cacheTtlSeconds = Number(process.env.CACHE_TTL_SECONDS || 10);
const productsUrl = "https://dummyjson.com/products";
const cacheKey = "products";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
}

if (!Number.isInteger(cacheTtlSeconds) || cacheTtlSeconds < 1) {
    throw new Error("CACHE_TTL_SECONDS must be a positive integer.");
}

function createRedisClient() {
    if (process.env.REDIS_URL) {
        return createClient({ url: process.env.REDIS_URL });
    }

    const host = process.env.REDIS_CLOUD_HOST;
    if (!host) return null;

    const redisPort = Number(process.env.REDIS_CLOUD_PORT || 6379);
    if (!Number.isInteger(redisPort) || redisPort < 1 || redisPort > 65535) {
        console.warn("Redis cache disabled because REDIS_CLOUD_PORT is invalid.");
        return null;
    }

    return createClient({
        password: process.env.REDIS_CLOUD_PASSWORD || undefined,
        socket: {
            host,
            port: redisPort,
            tls: process.env.REDIS_TLS === "true"
        }
    });
}

const redisClient = createRedisClient();

function logRedisIssue(error) {
    console.warn("Redis cache unavailable; continuing without cache.", error.code || error.name || "RedisError");
}

if (redisClient) {
    redisClient.on("error", logRedisIssue);
    redisClient.connect().then(() => {
        console.info("Redis cache connected.");
    }).catch(logRedisIssue);
} else {
    console.info("Redis is not configured; caching is disabled.");
}

async function readProductsCache() {
    if (!redisClient?.isReady) return null;

    try {
        const cached = await redisClient.get(cacheKey);
        if (!cached) return null;

        try {
            return JSON.parse(cached);
        } catch {
            await redisClient.del(cacheKey);
            return null;
        }
    } catch (error) {
        logRedisIssue(error);
        return null;
    }
}

async function cacheProducts(products) {
    if (!redisClient?.isReady) return;

    try {
        await redisClient.set(cacheKey, JSON.stringify(products), { EX: cacheTtlSeconds });
    } catch (error) {
        logRedisIssue(error);
    }
}

app.get("/api/a2rp", (_req, res) => {
    res.json({ success: true, message: "a2rp: an Ashish Ranjan presentation" });
});

async function getProducts(_req, res) {
    const cachedProducts = await readProductsCache();
    if (cachedProducts) {
        return res.json({ success: true, message: cachedProducts, source: "cache" });
    }

    try {
        const response = await fetch(productsUrl, { signal: AbortSignal.timeout(7000) });
        if (!response.ok) {
            return res.status(502).json({ success: false, message: "The product service returned an error." });
        }

        const products = await response.json();
        await cacheProducts(products);
        return res.json({ success: true, message: products, source: "upstream" });
    } catch (error) {
        console.error("Product request failed:", error.name || "RequestError");
        return res.status(502).json({ success: false, message: "Could not fetch products. Please try again." });
    }
}

app.get(["/api/products", "/api/get-products"], getProducts);

app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

const server = app.listen(port, () => {
    console.info(`Server running at http://127.0.0.1:${port}`);
});

async function shutdown(signal) {
    console.info(`${signal} received; shutting down.`);
    server.close(async () => {
        if (redisClient?.isOpen) {
            try {
                await redisClient.quit();
            } catch (error) {
                logRedisIssue(error);
            }
        }
        process.exit(0);
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
