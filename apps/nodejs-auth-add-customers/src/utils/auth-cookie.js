const TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const sameSite = (process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "none" : "lax")).toLowerCase();

if (!["lax", "strict", "none"].includes(sameSite)) {
    throw new Error("COOKIE_SAME_SITE must be lax, strict, or none.");
}

const secure = process.env.NODE_ENV === "production" || sameSite === "none";

const authCookieOptions = {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: TOKEN_LIFETIME_MS,
    path: "/",
};

const clearAuthCookieOptions = { ...authCookieOptions };
delete clearAuthCookieOptions.maxAge;

module.exports = {
    TOKEN_LIFETIME_MS,
    authCookieOptions,
    clearAuthCookieOptions,
};
