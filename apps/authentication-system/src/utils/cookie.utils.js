// Build secure cookie options for authentication tokens.
const getCookieOptions = (maxAge) => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge,
        path: "/",
    };
};

// Store the access token in an HttpOnly cookie.
const setAccessTokenCookie = (res, token) => {
    const maxAge = Number(process.env.ACCESS_COOKIE_MAX_AGE) || 15 * 60 * 1000;

    res.cookie("accessToken", token, getCookieOptions(maxAge));
};

// Store the refresh token in an HttpOnly cookie.
const setRefreshTokenCookie = (res, token) => {
    const maxAge =
        Number(process.env.REFRESH_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

    res.cookie("refreshToken", token, getCookieOptions(maxAge));
};

// Clear both authentication cookies during logout or invalidation.
const clearAuthCookies = (res) => {
    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    res.clearCookie("accessToken", options);

    res.clearCookie("refreshToken", options);
};

module.exports = {
    clearAuthCookies,
    setAccessTokenCookie,
    setRefreshTokenCookie,
};
