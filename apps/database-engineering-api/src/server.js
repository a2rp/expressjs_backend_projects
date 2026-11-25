require("dotenv").config();

const app = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");

const PORT = process.env.PORT || 1198;
const BASE_URL = `http://localhost:${PORT}`;

let server = null;

// Start the API only after MongoDB connects successfully.
const startServer = async () => {
    try {
        await connectDatabase();

        server = app.listen(PORT, () => {
            console.log("");
            console.log("Database Engineering API is running.");
            console.log(`Root:     ${BASE_URL}/`);
            console.log(`Health:   ${BASE_URL}/api/v1/health`);
            console.log(`Products: ${BASE_URL}/api/v1/products`);
            console.log("");
        });
    } catch (error) {
        console.error("Failed to start application:", error);
        process.exit(1);
    }
};

// Close both HTTP and MongoDB connections cleanly.
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
        console.error("Shutdown failed:", error);
        process.exit(1);
    }
};

process.on("SIGINT", () => {
    shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    shutdown("SIGTERM");
});

// Unexpected promise failures should terminate the process safely.
process.on("unhandledRejection", async (error) => {
    console.error("Unhandled promise rejection:", error);
    await shutdown("UNHANDLED_REJECTION");
});

// Unexpected synchronous failures cannot be safely recovered from.
process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    process.exit(1);
});

startServer();
