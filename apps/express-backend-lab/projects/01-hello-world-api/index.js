// Import express
const express = require("express");

// Create an express app
const app = express();

// Fixed port for this learning project
const PORT = 1198;

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Hello World from Express Backend Lab",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
