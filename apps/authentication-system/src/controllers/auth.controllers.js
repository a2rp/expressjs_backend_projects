const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const {
    clearAuthCookies,
    setAccessTokenCookie,
    setRefreshTokenCookie,
} = require("../utils/cookie.utils");

const {
    createExpiryDate,
    generateAccessToken,
    generateRandomToken,
    generateRefreshToken,
    hashToken,
    verifyRefreshToken,
} = require("../utils/token.utils");

// Register a new user and generate an email verification token.
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

        const verificationToken = generateRandomToken();

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            emailVerificationToken: hashToken(verificationToken),
            emailVerificationExpiresAt: createExpiryDate(24 * 60 * 60 * 1000),
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            data: {
                user,
                ...(process.env.NODE_ENV === "development"
                    ? { verificationToken }
                    : {}),
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Verify the user's email using the one-time verification token.
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        const hashedToken = hashToken(token.trim());

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpiresAt: {
                $gt: new Date(),
            },
        }).select("+emailVerificationToken +emailVerificationExpiresAt");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Verification token is invalid or expired.",
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpiresAt = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
        });
    } catch (error) {
        return next(error);
    }
};

// Authenticate the user and issue access and refresh tokens in HttpOnly cookies.
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password +refreshTokenHash +refreshTokenExpiresAt");

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

        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Verify your email before logging in.",
            });
        }

        // This API stores one refresh session per account, so a new login
        // invalidates access tokens issued by the previous session.
        user.authVersion = (user.authVersion || 0) + 1;

        const accessToken = generateAccessToken(
            user._id.toString(),
            user.authVersion,
        );

        const refreshToken = generateRefreshToken(user._id.toString());

        user.refreshTokenHash = hashToken(refreshToken);

        user.refreshTokenExpiresAt = createExpiryDate(
            Number(process.env.REFRESH_COOKIE_MAX_AGE) ||
                7 * 24 * 60 * 60 * 1000,
        );

        await user.save();

        setAccessTokenCookie(res, accessToken);

        setRefreshTokenCookie(res, refreshToken);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                user,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Issue a fresh access token after validating the refresh token.
const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required.",
            });
        }

        const payload = verifyRefreshToken(refreshToken);

        const user = await User.findById(payload.userId).select(
            "+refreshTokenHash +refreshTokenExpiresAt",
        );

        if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
            clearAuthCookies(res);

            return res.status(401).json({
                success: false,
                message: "Refresh session is invalid.",
            });
        }

        const refreshTokenMatches =
            hashToken(refreshToken) === user.refreshTokenHash;

        const refreshTokenExpired = user.refreshTokenExpiresAt <= new Date();

        if (!refreshTokenMatches || refreshTokenExpired) {
            user.refreshTokenHash = null;
            user.refreshTokenExpiresAt = null;

            await user.save();

            clearAuthCookies(res);

            return res.status(401).json({
                success: false,
                message: "Refresh token is invalid or expired.",
            });
        }

        const accessToken = generateAccessToken(
            user._id.toString(),
            user.authVersion,
        );

        setAccessTokenCookie(res, accessToken);

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully.",
        });
    } catch (error) {
        clearAuthCookies(res);

        return res.status(401).json({
            success: false,
            message: "Refresh token is invalid or expired.",
        });
    }
};

// Remove the stored refresh token and clear authentication cookies.
const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            const hashedToken = hashToken(refreshToken);

            const user = await User.findOne({
                refreshTokenHash: hashedToken,
            }).select("+refreshTokenHash +refreshTokenExpiresAt");

            if (user) {
                user.refreshTokenHash = null;
                user.refreshTokenExpiresAt = null;
                user.authVersion = (user.authVersion || 0) + 1;

                await user.save();
            }
        }

        clearAuthCookies(res);

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
        });
    } catch (error) {
        return next(error);
    }
};

// Return the authenticated user's public profile.
const getProfile = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Profile fetched successfully.",
        data: {
            user: req.user,
        },
    });
};

// Create a password-reset token for an existing account.
const forgotPassword = async (req, res, next) => {
    try {
        const normalizedEmail = req.body.email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+passwordResetToken +passwordResetExpiresAt");

        const publicMessage =
            "If the account exists, a password reset request has been created.";

        // Keep the public response the same whether the account exists or not.
        if (!user) {
            return res.status(200).json({
                success: true,
                message: publicMessage,
            });
        }

        const resetToken = generateRandomToken();

        user.passwordResetToken = hashToken(resetToken);

        user.passwordResetExpiresAt = createExpiryDate(30 * 60 * 1000);

        await user.save();

        return res.status(200).json({
            success: true,
            message: publicMessage,
            ...(process.env.NODE_ENV === "development"
                ? { data: { resetToken } }
                : {}),
        });
    } catch (error) {
        return next(error);
    }
};

// Set a new password after validating the password-reset token.
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        const hashedToken = hashToken(token.trim());

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpiresAt: {
                $gt: new Date(),
            },
        }).select(
            "+password +passwordResetToken +passwordResetExpiresAt +refreshTokenHash +refreshTokenExpiresAt",
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Password reset token is invalid or expired.",
            });
        }

        user.password = password;
        user.passwordChangedAt = new Date();
        user.authVersion = (user.authVersion || 0) + 1;

        user.passwordResetToken = null;
        user.passwordResetExpiresAt = null;

        // Invalidate existing login sessions after a password reset.
        user.refreshTokenHash = null;
        user.refreshTokenExpiresAt = null;

        await user.save();

        clearAuthCookies(res);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please log in again.",
        });
    } catch (error) {
        return next(error);
    }
};

// Generate a fresh verification token for an unverified account.
const resendVerification = async (req, res, next) => {
    try {
        const normalizedEmail = req.body.email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+emailVerificationToken +emailVerificationExpiresAt");

        const publicMessage =
            "If the account exists and needs verification, a verification request has been created.";

        // Avoid revealing whether an account exists or is already verified.
        if (!user || user.isEmailVerified) {
            return res.status(200).json({
                success: true,
                message: publicMessage,
            });
        }

        const verificationToken = generateRandomToken();

        user.emailVerificationToken = hashToken(verificationToken);

        user.emailVerificationExpiresAt = createExpiryDate(24 * 60 * 60 * 1000);

        await user.save();

        return res.status(200).json({
            success: true,
            message: publicMessage,
            ...(process.env.NODE_ENV === "development"
                ? { data: { verificationToken } }
                : {}),
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    forgotPassword,
    getProfile,
    login,
    logout,
    refreshAccessToken,
    register,
    resendVerification,
    resetPassword,
    verifyEmail,
};
