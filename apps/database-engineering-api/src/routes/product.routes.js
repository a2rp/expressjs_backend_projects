const express = require("express");

const {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    restoreProduct,
    updateProduct,
} = require("../controllers/product.controllers");

const {
    validateProductId,
    validateProductInput,
    validateProductQuery,
} = require("../validators/product.validators");

const router = express.Router();

// Get products with search, filters, sorting, pagination, and soft-delete options.
router.get("/", validateProductQuery, getProducts);

// Get one product by MongoDB ObjectId.
router.get("/:id", validateProductId, getProductById);

// Create a new product document.
router.post("/", validateProductInput, createProduct);

// Update an active product.
router.put("/:id", validateProductId, validateProductInput, updateProduct);

// Soft-delete an active product.
router.delete("/:id", validateProductId, deleteProduct);

// Restore a previously soft-deleted product.
router.patch("/:id/restore", validateProductId, restoreProduct);

module.exports = router;
