const products = require("../data/product.data");

const getProducts = (req, res) => {
    const {
        search = "",
        category,
        minPrice,
        maxPrice,
        inStock,
        sort = "id",
        order = "asc",
        page = "1",
        limit = "10",
    } = req.query;

    let result = [...products];

    if (search) {
        const searchText = search.toLowerCase();

        result = result.filter(
            (product) =>
                product.name.toLowerCase().includes(searchText) ||
                product.description.toLowerCase().includes(searchText),
        );
    }

    if (category) {
        result = result.filter(
            (product) =>
                product.category.toLowerCase() === category.toLowerCase(),
        );
    }

    if (minPrice !== undefined) {
        result = result.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice !== undefined) {
        result = result.filter((product) => product.price <= Number(maxPrice));
    }

    if (inStock !== undefined) {
        const stockValue = inStock === "true";

        result = result.filter((product) => product.inStock === stockValue);
    }

    result.sort((firstProduct, secondProduct) => {
        const firstValue = firstProduct[sort];
        const secondValue = secondProduct[sort];

        if (typeof firstValue === "string") {
            return order === "desc"
                ? secondValue.localeCompare(firstValue)
                : firstValue.localeCompare(secondValue);
        }

        return order === "desc"
            ? secondValue - firstValue
            : firstValue - secondValue;
    });

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / pageLimit);

    const startIndex = (currentPage - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;

    const paginatedProducts = result.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        message: "Products fetched successfully.",
        data: paginatedProducts,
        pagination: {
            page: currentPage,
            limit: pageLimit,
            totalItems,
            totalPages,
        },
    });
};

const getProductById = (req, res) => {
    const productId = Number(req.params.id);

    const product = products.find((item) => item.id === productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Product fetched successfully.",
        data: product,
    });
};

const createProduct = (req, res) => {
    const { name, description, category, price, inStock } = req.body;

    const nextId =
        products.length > 0
            ? Math.max(...products.map((product) => product.id)) + 1
            : 1;

    const newProduct = {
        id: nextId,
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: Number(price),
        inStock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);

    return res.status(201).json({
        success: true,
        message: "Product created successfully.",
        data: newProduct,
    });
};

const updateProduct = (req, res) => {
    const productId = Number(req.params.id);

    const productIndex = products.findIndex((item) => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    const { name, description, category, price, inStock } = req.body;

    const currentProduct = products[productIndex];

    const updatedProduct = {
        id: currentProduct.id,
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: Number(price),
        inStock,
        createdAt: currentProduct.createdAt,
        updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;

    return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: updatedProduct,
    });
};

const deleteProduct = (req, res) => {
    const productId = Number(req.params.id);

    const productIndex = products.findIndex((item) => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    const [deletedProduct] = products.splice(productIndex, 1);

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
        data: deletedProduct,
    });
};

module.exports = {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
};
