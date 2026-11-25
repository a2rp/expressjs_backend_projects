const parsePositiveId = require("../utils/parsePositiveId");

const products = [
    { id: 1, name: "Product 1", price: 499 },
    { id: 2, name: "Product 2", price: 999 },
];

const getAllProducts = (req, res) => {
    res.json({
        message: "All products fetched successfully",
        data: products,
    });
};

const getProductById = (req, res) => {
    const id = parsePositiveId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            message: "Product id must be a positive integer.",
        });
    }

    const product = products.find((item) => item.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    res.json({
        message: "Single product fetched successfully",
        data: product,
    });
};

module.exports = {
    getAllProducts,
    getProductById,
};
