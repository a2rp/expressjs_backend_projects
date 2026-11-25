const mongoose = require("mongoose");

// Connect the application to MongoDB using the URI from environment variables.
const connectDatabase = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not configured.");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully.");
};

// Close the active MongoDB connection during graceful shutdown.
const disconnectDatabase = async () => {
    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
};

module.exports = {
    connectDatabase,
    disconnectDatabase,
};
