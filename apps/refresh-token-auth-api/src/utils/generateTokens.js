const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
        algorithm: "HS256",
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
        algorithm: "HS256",
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
