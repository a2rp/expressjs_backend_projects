const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, { algorithms: ["HS256"] });
        } catch {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (typeof decoded.userId !== "string" || !mongoose.isValidObjectId(decoded.userId)) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = protect;
