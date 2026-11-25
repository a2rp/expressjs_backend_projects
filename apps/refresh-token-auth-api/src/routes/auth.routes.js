const express = require("express");
const {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getMe,
} = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

module.exports = router;
