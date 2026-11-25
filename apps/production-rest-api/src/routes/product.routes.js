const express = require("express");

const {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} = require("../controllers/product.controllers");

const {
    validateProductId,
    validateProductInput,
    validateProductQuery,
} = require("../validators/product.validators");

const router = express.Router();

router.get("/", validateProductQuery, getProducts);

router.get("/:id", validateProductId, getProductById);

router.post("/", validateProductInput, createProduct);

router.put("/:id", validateProductId, validateProductInput, updateProduct);

router.delete("/:id", validateProductId, deleteProduct);

module.exports = router;
