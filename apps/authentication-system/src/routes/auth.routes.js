const express = require("express");

const {
    forgotPassword,
    getProfile,
    login,
    logout,
    refreshAccessToken,
    register,
    resendVerification,
    resetPassword,
    verifyEmail,
} = require("../controllers/auth.controllers");

const { requireAuth } = require("../middlewares/auth.middleware");

const {
    validateEmailOnly,
    validateLogin,
    validateRegister,
    validateResetPassword,
    validateToken,
} = require("../validators/auth.validators");

const router = express.Router();

// Create a new account.
router.post("/register", validateRegister, register);

// Verify a newly created account using a one-time token.
router.post("/verify-email", validateToken, verifyEmail);

// Generate a fresh email verification token.
router.post("/resend-verification", validateEmailOnly, resendVerification);

// Authenticate the user and create access and refresh cookies.
router.post("/login", validateLogin, login);

// Use a valid refresh token to issue a new access token.
router.post("/refresh", refreshAccessToken);

// End the current authentication session.
router.post("/logout", logout);

// Return the currently authenticated user's profile.
router.get("/profile", requireAuth, getProfile);

// Generate a password reset token.
router.post("/forgot-password", validateEmailOnly, forgotPassword);

// Reset the password using a valid reset token.
router.post("/reset-password", validateResetPassword, resetPassword);

module.exports = router;
