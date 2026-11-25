// auth endpoints: register, login, me, logout
// keeps comments short and practical
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const isProd = process.env.NODE_ENV === "production";
const COOKIE_NAME = "access_token";
const COOKIE_SAME_SITE = (process.env.COOKIE_SAME_SITE || "lax").toLowerCase();
const JWT_EXPIRES = process.env.JWT_EXPIRES || "2h"; // e.g. "2h", "7d"
const expiryMatch = /^([1-9]\d*)(s|m|h|d)$/.exec(JWT_EXPIRES);
if (!expiryMatch) throw new Error("JWT_EXPIRES must use seconds, minutes, hours, or days (for example, 2h).");
const unitMs = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
const cookieMaxAge = Number(expiryMatch[1]) * unitMs[expiryMatch[2]];
if (!Number.isSafeInteger(cookieMaxAge)) throw new Error("JWT_EXPIRES is too large.");

const passwordSchema = z.string().min(8).max(72).refine(
    (value) => Buffer.byteLength(value, "utf8") <= 72,
    { message: "Password cannot exceed 72 bytes." }
);

// sign a short-lived token
function signAccessToken(userId) {
    return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
        algorithm: "HS256",
    });
}

// set cookie (httpOnly so JS can't read it)
function setAuthCookie(res, token) {
    const base = {
        httpOnly: true,
        secure: isProd,
        sameSite: COOKIE_SAME_SITE,
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/",
    };

    res.cookie(COOKIE_NAME, token, { ...base, maxAge: cookieMaxAge });
}

function clearAuthCookie(res) {
    const base = {
        httpOnly: true,
        secure: isProd,
        sameSite: COOKIE_SAME_SITE,
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/",
    };
    res.clearCookie(COOKIE_NAME, base);
}

// lightweight input validation
const registerSchema = z.object({
    name: z.string().trim().min(2).max(60),
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    password: passwordSchema,
});

const loginSchema = z.object({
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    password: passwordSchema,
});

// POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const data = registerSchema.parse(req.body);

        // unique email check
        const exists = await User.findOne({ email: data.email }).lean();
        if (exists)
            return res
                .status(409)
                .json({ ok: false, message: "Email already in use" });

        const user = await User.create(data);

        // login right away
        const token = signAccessToken(user._id);
        setAuthCookie(res, token);

        res.status(201).json({
            ok: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        if (err.name === "ZodError") {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "Invalid input",
                    issues: err.issues.map(({ path, message }) => ({ path, message })),
                });
        }
        if (err?.code === 11000) {
            return res
                .status(409)
                .json({ ok: false, message: "Email already in use" });
        }
        next(err);
    }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res
                .status(401)
                .json({ ok: false, message: "Invalid credentials" });

        const ok = await user.comparePassword(password);
        if (!ok)
            return res
                .status(401)
                .json({ ok: false, message: "Invalid credentials" });

        const token = signAccessToken(user._id);
        setAuthCookie(res, token);

        res.json({
            ok: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        if (err.name === "ZodError") {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "Invalid input",
                    issues: err.issues.map(({ path, message }) => ({ path, message })),
                });
        }
        next(err);
    }
};

// GET /api/auth/me
exports.me = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select(
            "name email role createdAt"
        );
        if (!user)
            return res
                .status(404)
                .json({ ok: false, message: "User not found" });

        res.json({
            ok: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/logout
exports.logout = async (_req, res, _next) => {
    clearAuthCookie(res);
    res.json({ ok: true, message: "Logged out" });
};
