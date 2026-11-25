const express = require("express");
const userRoutes = require("./src/routes/user.route");
const productRoutes = require("./src/routes/product.route");

const app = express();
const PORT = 1198;

app.get("/", (req, res) => {
    res.json({
        message: "Multiple Route Modules API is running",
    });
});

app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
