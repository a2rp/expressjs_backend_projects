const allowedSortFields = [
    "id",
    "name",
    "category",
    "price",
    "inStock",
    "createdAt",
    "updatedAt",
];

const validateProductId = (req, res, next) => {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Product ID must be a positive integer.",
        });
    }

    return next();
};

const validateProductInput = (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: ["Request body must be a JSON object."],
        });
    }

    const { name, description, category, price, inStock } = body;

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

const validateProductQuery = (req, res, next) => {
    const {
        minPrice,
        maxPrice,
        inStock,
        sort = "id",
        order = "asc",
        page = "1",
        limit = "10",
    } = req.query;

    const errors = [];
    const queryValues = {
        search: req.query.search,
        category,
        minPrice,
        maxPrice,
        inStock,
        sort,
        order,
        page,
        limit,
    };

    for (const [name, value] of Object.entries(queryValues)) {
        if (value !== undefined && typeof value !== "string") {
            errors.push(`${name} must be a single string value.`);
        }
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

    if (inStock !== undefined && !["true", "false"].includes(inStock)) {
        errors.push("inStock must be either true or false.");
    }

    if (!allowedSortFields.includes(sort)) {
        errors.push(`sort must be one of: ${allowedSortFields.join(", ")}.`);
    }

    if (!["asc", "desc"].includes(order)) {
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
