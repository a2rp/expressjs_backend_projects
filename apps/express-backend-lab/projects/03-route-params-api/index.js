// Import express
const express = require("express");

// Create express app
const app = express();

// Fixed port for this learning project
const PORT = 1198;

// Route params example
app.get("/users/:id", (req, res) => {
    // Read dynamic value from URL
    const { id } = req.params;

    res.status(200).json({
        success: true,
        project: "03 - Route Params API",
        message: "User data fetched successfully using route parameter",
        user: {
            id: id,
            name: `User ${id}`,
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
