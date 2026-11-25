require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./api/routes/user.routes");
const User = require("./api/models/users.model");

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb", strict: true }));
app.use(userRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

app.use((error, _req, res, _next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Request body must contain valid JSON." });
    }
    if (error.type === "entity.too.large") {
        return res.status(413).json({ message: "Request body is too large." });
    }

    console.error("Request failed:", error.name, error.code || "");
    return res.status(500).json({ message: "An unexpected server error occurred." });
});

async function startServer() {
    const mongoUrl = process.env.MONGODB_LOCAL_URL;
    if (!mongoUrl) throw new Error("MONGODB_LOCAL_URL is required.");

    const port = Number(process.env.PORT || 1198);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT must be an integer between 1 and 65535.");
    }

    const host = process.env.HOST || "127.0.0.1";
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    await User.init();
    app.listen(port, host, () => console.log(`MongoDB CRUD API listening at http://${host}:${port}`));
}

if (require.main === module) {
    startServer().catch(async (error) => {
        console.error("Could not start MongoDB CRUD API:", error.name);
        await mongoose.disconnect().catch(() => {});
        process.exitCode = 1;
    });
}

module.exports = app;
