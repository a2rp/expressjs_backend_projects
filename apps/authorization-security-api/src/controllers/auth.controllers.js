const { User } = require("../models/user.model");

const { generateAccessToken } = require("../utils/token.utils");

// Register a standard user account.
// Role and permission changes are intentionally handled by protected admin routes.
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                user,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Authenticate a user and return a short-lived Bearer access token.
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const passwordMatches = await user.comparePassword(password);

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "This account is inactive.",
            });
        }

        const accessToken = generateAccessToken(user._id.toString());

        // Remove the selected password before returning user data.
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                accessToken,
                tokenType: "Bearer",
                user,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Return the currently authenticated user's authorization context.
const getProfile = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Authorization profile fetched successfully.",
        data: {
            user: req.user,
            authorization: {
                role: req.user.role,
                permissions: req.user.permissions,
            },
        },
    });
};

module.exports = {
    getProfile,
    login,
    register,
};
