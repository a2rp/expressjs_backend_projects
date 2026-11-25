const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.COOKIE_SAME_SITE || "lax").toLowerCase(),
};

const accessTokenCookieOptions = {
    ...baseCookieOptions,
    path: "/",
    maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
    ...baseCookieOptions,
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearAccessTokenCookieOptions = { ...accessTokenCookieOptions, maxAge: undefined };
const clearRefreshTokenCookieOptions = { ...refreshTokenCookieOptions, maxAge: undefined };

module.exports = {
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
    clearAccessTokenCookieOptions,
    clearRefreshTokenCookieOptions,
};
