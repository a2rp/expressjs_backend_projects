const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { TOKEN_LIFETIME_MS, authCookieOptions, clearAuthCookieOptions } = require("../utils/auth-cookie");

const MIN_PASSWORD_LENGTH = 8;
const MAX_BCRYPT_PASSWORD_BYTES = 72;
const BCRYPT_ROUNDS = 10;
const TOKEN_LIFETIME = "7d";

function issueToken(userId, res) {
    const token = jwt.sign(
        { user: String(userId) },
        process.env.JWT_SECRET,
        { algorithm: "HS256", expiresIn: TOKEN_LIFETIME }
    );

    res.cookie("token", token, { ...authCookieOptions, maxAge: TOKEN_LIFETIME_MS });
}

function handleServerError(res, error) {
    if (error.code === 11000) {
        return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    console.error("User request failed:", error.name || "Error");
    return res.status(500).json({ success: false, message: "Internal server error." });
}

module.exports.register = async (req, res) => {
    try {
        const { email, password, passwordVerify } = req.body || {};
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!normalizedEmail || typeof password !== "string" || typeof passwordVerify !== "string") {
            return res.status(400).json({ success: false, message: "Email, password, and password confirmation are required." });
        }

        if (normalizedEmail.length > 254 || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            return res.status(400).json({ success: false, message: "Enter a valid email address." });
        }

        if (password.length < MIN_PASSWORD_LENGTH || Buffer.byteLength(password, "utf8") > MAX_BCRYPT_PASSWORD_BYTES) {
            return res.status(400).json({
                success: false,
                message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters and no more than ${MAX_BCRYPT_PASSWORD_BYTES} UTF-8 bytes.`,
            });
        }

        if (password !== passwordVerify) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }

        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const newUser = await User.create({ email: normalizedEmail, password: passwordHash });

        issueToken(newUser._id, res);
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: { _id: newUser._id, email: newUser.email },
        });
    } catch (error) {
        return handleServerError(res, error);
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!normalizedEmail || normalizedEmail.length > 254 || typeof password !== "string") {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        if (Buffer.byteLength(password, "utf8") > MAX_BCRYPT_PASSWORD_BYTES) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const existingUser = await User.findOne({ email: normalizedEmail }).select("+password");
        const passwordCorrect = existingUser && await bcrypt.compare(password, existingUser.password);

        if (!passwordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        issueToken(existingUser._id, res);
        return res.json({
            success: true,
            message: "Logged in successfully.",
            user: { _id: existingUser._id, email: existingUser.email },
        });
    } catch (error) {
        return handleServerError(res, error);
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie("token", clearAuthCookieOptions);
    return res.json({ success: true, message: "Logged out successfully." });
};

module.exports.isLoggedIn = (req, res) => {
    return res.json({ success: true, user: req.user });
};
