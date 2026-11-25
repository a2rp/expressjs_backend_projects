require("dotenv").config();

const app = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");

const PORT = Number(process.env.PORT || 1198);
const HOST = process.env.HOST || "127.0.0.1";
const BASE_URL = `http://${HOST}:${PORT}`;

let server = null;

// Start the API only after MongoDB connects successfully.
const startServer = async () => {
    try {
        if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
            throw new Error("PORT must be an integer between 1 and 65535.");
        }

        if (Buffer.byteLength(process.env.API_KEY || "") < 32) {
            throw new Error("API_KEY must contain at least 32 bytes.");
        }

        await connectDatabase();

        server = app.listen(PORT, HOST, () => {
            console.log("");
            console.log("Notification Service is running.");
            console.log(`Root:          ${BASE_URL}/`);
            console.log(`Health:        ${BASE_URL}/api/v1/health`);
            console.log(`Notifications: ${BASE_URL}/api/v1/notifications`);
            console.log("");
        });
    } catch (error) {
        console.error("Failed to start application:", error.name || "Error", error.code || "");
        process.exit(1);
    }
};

// Close the HTTP server and database connection cleanly.
const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down application...`);

    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });

            console.log("HTTP server stopped.");
        }

        await disconnectDatabase();

        process.exit(0);
    } catch (error) {
        console.error("Shutdown failed:", error.name || "Error", error.code || "");
        process.exit(1);
    }
};

process.on("SIGINT", () => {
    shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    shutdown("SIGTERM");
});

process.on("unhandledRejection", async (error) => {
    console.error("Unhandled promise rejection:", error.name || "Error", error.code || "");
    await shutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error.name || "Error", error.code || "");
    process.exit(1);
});

startServer();
