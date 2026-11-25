const products = require("../data/products");

let nextProductId = Math.max(0, ...products.map((product) => product.id)) + 1;

const parseProduct = (body) => {
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const rawPrice = body?.price;
    const priceText = typeof rawPrice === "string" ? rawPrice.trim() : "";
    const isNumericPrice =
        typeof rawPrice === "number" ||
        (priceText !== "" && /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(priceText));
    const price = isNumericPrice ? Number(rawPrice) : Number.NaN;

    if (!name || name.length > 120 || !Number.isFinite(price) || price < 0) {
        return null;
    }

    return { name, price };
};

const getProductId = (req, res) => {
    const rawId = req.params.id;
    const productId = /^\d+$/.test(rawId) ? Number(rawId) : Number.NaN;

    if (!Number.isSafeInteger(productId) || productId < 1) {
        res.status(400).json({
            success: false,
            message: "Product ID must be a positive integer.",
        });
        return null;
    }

    return productId;
};

const getAllProducts = (req, res) => {
    res.status(200).json({
        success: true,
        count: products.length,
        data: products,
    });
};

const getProductById = (req, res) => {
    const productId = getProductId(req, res);
    if (productId === null) return;

    const product = products.find((item) => item.id === productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    res.status(200).json({
        success: true,
        data: product,
    });
};

const createProduct = (req, res) => {
    const product = parseProduct(req.body);

    if (!product) {
        return res.status(400).json({
            success: false,
            message: "Product name (up to 120 characters) and a non-negative numeric price are required.",
        });
    }

    const newProduct = {
        id: nextProductId++,
        ...product,
    };

    products.push(newProduct);

    res.status(201).json({
        success: true,
        message: "Product created successfully.",
        data: newProduct,
    });
};

const updateProduct = (req, res) => {
    const productId = getProductId(req, res);
    if (productId === null) return;

    const product = products.find((item) => item.id === productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    const values = parseProduct(req.body);

    if (!values) {
        return res.status(400).json({
            success: false,
            message: "Product name (up to 120 characters) and a non-negative numeric price are required.",
        });
    }

    product.name = values.name;
    product.price = values.price;

    res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: product,
    });
};

const deleteProduct = (req, res) => {
    const productId = getProductId(req, res);
    if (productId === null) return;

    const productIndex = products.findIndex((item) => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    products.splice(productIndex, 1);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
