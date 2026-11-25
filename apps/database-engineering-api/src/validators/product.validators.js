const mongoose = require("mongoose");

const allowedSortFields = [
    "name",
    "category",
    "price",
    "inStock",
    "createdAt",
    "updatedAt",
];

// Validate MongoDB ObjectId values before they reach the controller.
const validateProductId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID.",
        });
    }

    return next();
};

// Validate the full product payload used by create and update routes.
const validateProductInput = (req, res, next) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a JSON object.",
        });
    }

    const { name, description, category, price, inStock } = req.body;

    const errors = [];

    if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 100
    ) {
        errors.push("Name must be between 2 and 100 characters.");
    }

    if (
        typeof description !== "string" ||
        description.trim().length < 5 ||
        description.trim().length > 500
    ) {
        errors.push("Description must be between 5 and 500 characters.");
    }

    if (
        typeof category !== "string" ||
        category.trim().length < 2 ||
        category.trim().length > 50
    ) {
        errors.push("Category must be between 2 and 50 characters.");
    }

    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        errors.push("Price must be a valid non-negative number.");
    }

    if (typeof inStock !== "boolean") {
        errors.push("inStock must be either true or false.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors,
        });
    }

    return next();
};

// Validate query parameters used for searching, filtering,
// sorting, pagination, and soft-delete visibility.
const validateProductQuery = (req, res, next) => {
    const {
        minPrice,
        maxPrice,
        search,
        category,
        inStock,
        includeDeleted,
        sort = "createdAt",
        order = "desc",
        page = "1",
        limit = "10",
    } = req.query;

    const errors = [];

    if (
        search !== undefined &&
        (typeof search !== "string" || search.length > 100)
    ) {
        errors.push("search must be a string with at most 100 characters.");
    }

    if (
        category !== undefined &&
        (typeof category !== "string" || category.trim().length > 50)
    ) {
        errors.push("category must be a string with at most 50 characters.");
    }

    if (
        minPrice !== undefined &&
        (!Number.isFinite(Number(minPrice)) || Number(minPrice) < 0)
    ) {
        errors.push("minPrice must be a valid non-negative number.");
    }

    if (
        maxPrice !== undefined &&
        (!Number.isFinite(Number(maxPrice)) || Number(maxPrice) < 0)
    ) {
        errors.push("maxPrice must be a valid non-negative number.");
    }

    if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        Number(minPrice) > Number(maxPrice)
    ) {
        errors.push("minPrice cannot be greater than maxPrice.");
    }

    if (
        inStock !== undefined &&
        (typeof inStock !== "string" || !["true", "false"].includes(inStock))
    ) {
        errors.push("inStock must be either true or false.");
    }

    if (
        includeDeleted !== undefined &&
        (typeof includeDeleted !== "string" ||
            !["true", "false"].includes(includeDeleted))
    ) {
        errors.push("includeDeleted must be either true or false.");
    }

    if (typeof sort !== "string" || !allowedSortFields.includes(sort)) {
        errors.push(`sort must be one of: ${allowedSortFields.join(", ")}.`);
    }

    if (typeof order !== "string" || !["asc", "desc"].includes(order)) {
        errors.push("order must be either asc or desc.");
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
        errors.push("page must be a positive integer.");
    }

    if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100
    ) {
        errors.push("limit must be an integer between 1 and 100.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid query parameters.",
            errors,
        });
    }

    return next();
};

module.exports = {
    validateProductId,
    validateProductInput,
    validateProductQuery,
};
