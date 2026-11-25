// pulls JWT from httpOnly cookie, verifies it, and exposes req.userId
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const COOKIE_NAME = "access_token";

module.exports = function requireAuth(req, res, next) {
    try {
        const token = req.cookies && req.cookies[COOKIE_NAME];
        if (!token)
            return res
                .status(401)
                .json({ ok: false, message: "Not authenticated" });

        const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        if (typeof payload.sub !== "string" || !mongoose.isValidObjectId(payload.sub)) {
            return res.status(401).json({ ok: false, message: "Invalid token" });
        }
        req.userId = String(payload.sub);
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ ok: false, message: "Session expired" });
        }
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
};
