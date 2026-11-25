const Product = require("../models/product.model");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Fetch products with pagination, filtering, sorting, searching,
// and optional access to soft-deleted records.
const getProducts = async (req, res, next) => {
    try {
        const {
            search = "",
            category,
            minPrice,
            maxPrice,
            inStock,
            includeDeleted = "false",
            sort = "createdAt",
            order = "desc",
            page = "1",
            limit = "10",
        } = req.query;

        const filter = {};

        // Hide soft-deleted products unless explicitly requested.
        if (includeDeleted !== "true") {
            filter.deletedAt = null;
        }

        // Use the text index defined on name and description.
        if (search) {
            filter.$text = {
                $search: search,
            };
        }

        // Match category values without depending on letter case.
        if (category) {
            filter.category = {
                $regex: `^${escapeRegex(category.trim())}$`,
                $options: "i",
            };
        }

        // Build a price range only when one or both limits are supplied.
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        if (inStock !== undefined) {
            filter.inStock = inStock === "true";
        }

        const currentPage = Number(page);
        const pageLimit = Number(limit);
        const skip = (currentPage - 1) * pageLimit;

        // Only allow known fields to control MongoDB sorting.
        const sortMap = {
            name: "name",
            category: "category",
            price: "price",
            inStock: "inStock",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        };

        const sortField = sortMap[sort] || "createdAt";
        const sortDirection = order === "asc" ? 1 : -1;

        // Count matching records separately to create pagination metadata.
        const totalItems = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort({
                [sortField]: sortDirection,
            })
            .skip(skip)
            .limit(pageLimit)
            .lean();

        const totalPages =
            totalItems === 0 ? 0 : Math.ceil(totalItems / pageLimit);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            data: products,
            pagination: {
                page: currentPage,
                limit: pageLimit,
                totalItems,
                totalPages,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Fetch a single product by MongoDB document ID.
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            deletedAt: null,
        }).lean();

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
    } catch (error) {
        return next(error);
    }
};

// Create and persist a new MongoDB product document.
const createProduct = async (req, res, next) => {
    try {
        const { name, description, category, price, inStock } = req.body;

        const product = await Product.create({
            name,
            description,
            category,
            price,
            inStock,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product,
        });
    } catch (error) {
        return next(error);
    }
};

// Update an active product and return the updated document.
const updateProduct = async (req, res, next) => {
    try {
        const { name, description, category, price, inStock } = req.body;

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                deletedAt: null,
            },
            {
                name,
                description,
                category,
                price,
                inStock,
            },
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Active product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product,
        });
    } catch (error) {
        return next(error);
    }
};

// Soft-delete a product by storing the deletion timestamp.
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                deletedAt: null,
            },
            {
                deletedAt: new Date(),
            },
            {
                returnDocument: "after",
            },
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Active product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product soft-deleted successfully.",
            data: product,
        });
    } catch (error) {
        return next(error);
    }
};

// Restore a previously soft-deleted product.
const restoreProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                deletedAt: {
                    $ne: null,
                },
            },
            {
                deletedAt: null,
            },
            {
                returnDocument: "after",
            },
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Deleted product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product restored successfully.",
            data: product,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    restoreProduct,
    updateProduct,
};
