const express = require("express");

const {
    getProfile,
    login,
    register,
} = require("../controllers/auth.controllers");

const { requireAuth } = require("../middlewares/auth.middleware");

const {
    validateLogin,
    validateRegister,
} = require("../validators/auth.validators");

const router = express.Router();

// Register a standard user account.
router.post("/register", validateRegister, register);

// Authenticate a user and return a Bearer access token.
router.post("/login", validateLogin, login);

// Return the authenticated user's role and permission context.
router.get("/profile", requireAuth, getProfile);

module.exports = router;
