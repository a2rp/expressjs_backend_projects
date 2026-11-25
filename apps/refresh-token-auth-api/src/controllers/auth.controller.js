const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const {
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
    clearAccessTokenCookieOptions,
    clearRefreshTokenCookieOptions,
} = require("../utils/cookieOptions");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicUser = (user) => ({ _id: user._id, name: user.name, email: user.email });
const validate = ({ name, email, password }, registration = false) => {
    if (registration && (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100)) return "Name must contain 2 to 100 characters";
    if (typeof email !== "string" || email.trim().length > 254 || !emailPattern.test(email.trim())) return "A valid email is required";
    if (typeof password !== "string" || [...password].length < 8 || Buffer.byteLength(password, "utf8") > 72) {
        return "Password must contain at least 8 characters and no more than 72 UTF-8 bytes";
    }
    return null;
};

const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        const validationError = validate({ name, email, password }, true);
        if (validationError) return res.status(422).json({ message: validationError });
        const normalizedEmail = email.trim().toLowerCase();
        if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: "User already exists" });
        const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
        await user.save();
        setTokenCookies(res, accessToken, refreshToken);
        return res.status(201).json({ message: "User registered successfully", user: publicUser(user) });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "User already exists" });
        console.error("Registration failed:", error.message);
        return res.status(500).json({ message: "Registration failed" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const validationError = validate({ email, password });
        if (validationError) return res.status(422).json({ message: validationError });
        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password +refreshTokenHash");
        if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: "Invalid credentials" });
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
        await user.save();
        setTokenCookies(res, accessToken, refreshToken);
        return res.status(200).json({ message: "Login successful", user: publicUser(user) });
    } catch (error) {
        console.error("Login failed:", error.message);
        return res.status(500).json({ message: "Login failed" });
    }
};

const refreshAccessToken = async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        if (!incomingRefreshToken) return res.status(401).json({ message: "Refresh token required" });
        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET, { algorithms: ["HS256"] });
        } catch {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        if (typeof decoded.userId !== "string" || !mongoose.isValidObjectId(decoded.userId)) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const user = await User.findById(decoded.userId).select("+refreshTokenHash");
        if (!user || !user.refreshTokenHash) return res.status(401).json({ message: "Invalid refresh token" });
        const currentHash = user.refreshTokenHash;
        const matches = await bcrypt.compare(incomingRefreshToken, currentHash);
        if (!matches) {
            await User.findOneAndUpdate({ _id: user._id, refreshTokenHash: currentHash }, { $set: { refreshTokenHash: "" } });
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        const newHash = await bcrypt.hash(newRefreshToken, 12);
        const rotatedUser = await User.findOneAndUpdate(
            { _id: user._id, refreshTokenHash: currentHash },
            { $set: { refreshTokenHash: newHash } },
            { new: true },
        );
        if (!rotatedUser) return res.status(401).json({ message: "Invalid refresh token" });
        setTokenCookies(res, newAccessToken, newRefreshToken);
        return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
        return next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        if (incomingRefreshToken) {
            let decoded;
            try {
                decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET, { algorithms: ["HS256"] });
            } catch {
                decoded = null;
            }
            if (typeof decoded?.userId === "string" && mongoose.isValidObjectId(decoded.userId)) {
                const user = await User.findById(decoded.userId).select("+refreshTokenHash");
                if (user?.refreshTokenHash && await bcrypt.compare(incomingRefreshToken, user.refreshTokenHash)) {
                    await User.findOneAndUpdate(
                        { _id: user._id, refreshTokenHash: user.refreshTokenHash },
                        { $set: { refreshTokenHash: "" } },
                    );
                }
            }
        }
        res.clearCookie("accessToken", clearAccessTokenCookieOptions);
        res.clearCookie("refreshToken", clearRefreshTokenCookieOptions);
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout failed:", error);
        res.clearCookie("accessToken", clearAccessTokenCookieOptions);
        res.clearCookie("refreshToken", clearRefreshTokenCookieOptions);
        return next(error);
    }
};

const getMe = (req, res) => res.status(200).json({ message: "User fetched successfully", user: publicUser(req.user) });

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser, getMe };
