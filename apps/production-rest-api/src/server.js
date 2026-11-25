require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 1198;
const BASE_URL = `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
    console.log("");
    console.log("Production REST API is running.");
    console.log(`Root:    ${BASE_URL}/`);
    console.log(`Health:  ${BASE_URL}/api/v1/health`);
    console.log(`Products:${BASE_URL}/api/v1/products`);
    console.log("");
});

const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down server...`);

    server.close(() => {
        console.log("Server stopped.");
        process.exit(0);
    });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);

    server.close(() => {
        process.exit(1);
    });
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    process.exit(1);
});
