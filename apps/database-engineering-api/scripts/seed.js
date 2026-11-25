require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("../src/models/product.model");
const {
    connectDatabase,
    disconnectDatabase,
} = require("../src/config/database");

const products = [
    {
        name: "Wireless Keyboard",
        description: "Compact wireless keyboard for everyday productivity.",
        category: "Accessories",
        price: 2499,
        inStock: true,
    },
    {
        name: "Gaming Mouse",
        description: "Ergonomic gaming mouse with adjustable sensitivity.",
        category: "Accessories",
        price: 1899,
        inStock: true,
    },
    {
        name: "USB-C Hub",
        description: "Multi-port USB-C hub with HDMI and USB connectivity.",
        category: "Connectivity",
        price: 3299,
        inStock: true,
    },
    {
        name: "Laptop Stand",
        description: "Adjustable aluminum stand for laptops and notebooks.",
        category: "Workspace",
        price: 2799,
        inStock: false,
    },
    {
        name: "Mechanical Keyboard",
        description:
            "Mechanical keyboard with tactile switches and compact layout.",
        category: "Accessories",
        price: 5499,
        inStock: true,
    },
    {
        name: "Portable SSD",
        description: "High-speed portable SSD for backups and file transfers.",
        category: "Storage",
        price: 6999,
        inStock: true,
    },
    {
        name: "Noise Cancelling Headphones",
        description: "Over-ear headphones with active noise cancellation.",
        category: "Audio",
        price: 8999,
        inStock: false,
    },
    {
        name: "1080p Webcam",
        description: "Full HD webcam designed for video calls and streaming.",
        category: "Video",
        price: 3799,
        inStock: true,
    },
    {
        name: "Bluetooth Speaker",
        description:
            "Portable Bluetooth speaker with clear sound and long battery life.",
        category: "Audio",
        price: 2999,
        inStock: true,
    },
    {
        name: "27 Inch Monitor",
        description: "27-inch Full HD monitor for work and entertainment.",
        category: "Displays",
        price: 15999,
        inStock: true,
    },
];

// Seed the database with predictable demo data for testing and learning.
const seedDatabase = async () => {
    try {
        await connectDatabase();

        // Remove old product records so every seed starts from a clean state.
        await Product.deleteMany({});

        const insertedProducts = await Product.insertMany(products);

        console.log("");
        console.log("Database seeded successfully.");
        console.log(`Inserted products: ${insertedProducts.length}`);
        console.log("");
    } catch (error) {
        console.error("Database seeding failed:", error);
        process.exitCode = 1;
    } finally {
        await disconnectDatabase();

        // Mongoose may keep internal handles open briefly,
        // so explicitly close the process after cleanup.
        await mongoose.disconnect().catch(() => {});
    }
};

seedDatabase();
