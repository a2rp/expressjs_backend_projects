// Import express
const express = require("express");

// Create express app
const app = express();

// Fixed port for this learning project
const PORT = 1198;

// Static response route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        project: "02 - Static Response API",
        message: "This API returns static application information",
        appInfo: {
            name: "Express Backend Lab",
            version: "1.0.0",
            author: "Ashish Ranjan",
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
