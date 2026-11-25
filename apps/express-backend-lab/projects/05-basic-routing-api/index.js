// Import express
const express = require("express");

// Create app
const app = express();

// Port
const PORT = 1198;

// Middleware to parse JSON body (for POST requests)
app.use(express.json());

// Sample users are kept in memory while this server is running.
const users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
];
let nextUserId = users.length + 1;

/*
    GET route
    Used to fetch data
*/
app.get("/users", (req, res) => {
    res.status(200).json({
        success: true,
        project: "05 - Basic Routing API",
        message: "Users fetched successfully",
        data: users,
    });
});

/*
    POST route
    Used to create new data
*/
app.post("/users", (req, res) => {
    // Validate user input before creating the in-memory record.
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
        return res.status(400).json({
            success: false,
            project: "05 - Basic Routing API",
            message: "A non-empty name is required.",
        });
    }

    const user = { id: nextUserId++, name };
    users.push(user);

    res.status(201).json({
        success: true,
        project: "05 - Basic Routing API",
        message: "User created successfully",
        user,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
