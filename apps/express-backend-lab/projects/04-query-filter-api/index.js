// Import express
const express = require("express");

// Create express app
const app = express();

// Fixed port for this learning project
const PORT = 1198;

// Query params example
app.get("/users", (req, res) => {
    // Read query parameters from URL
    const { age, name } = req.query;

    res.status(200).json({
        success: true,
        project: "04 - Query Params API",
        message: "User data fetched using query parameters",
        filters: {
            age: age || null,
            name: name || null,
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
