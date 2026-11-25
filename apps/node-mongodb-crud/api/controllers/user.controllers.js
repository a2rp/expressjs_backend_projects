const mongoose = require("mongoose");
const User = require("../models/users.model");

const MAX_PAGE_SIZE = 100;
const ALLOWED_FIELDS = new Set(["name", "email", "phone"]);

function parseInteger(value, fallback, min, max) {
    if (value === undefined) return fallback;
    if (typeof value !== "string" || !/^\d+$/.test(value)) return null;

    const number = Number(value);
    return Number.isSafeInteger(number) && number >= min && number <= max ? number : null;
}

function readUserFields(body, { partial = false } = {}) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { error: "Send a JSON object containing user fields." };
    }

    const keys = Object.keys(body);
    if (keys.some((key) => !ALLOWED_FIELDS.has(key))) {
        return { error: "Only name, email, and phone fields are supported." };
    }
    if (keys.length === 0) {
        return { error: "At least one user field is required." };
    }

    const fields = {};
    for (const key of keys) {
        if (typeof body[key] !== "string") {
            return { error: `${key} must be a string.` };
        }
        fields[key] = body[key].trim();
        if (!fields[key]) {
            return { error: `${key} cannot be empty.` };
        }
    }

    if (!partial && ["name", "email", "phone"].some((key) => !(key in fields))) {
        return { error: "Name, email, and phone are all required." };
    }
    if (fields.name && fields.name.length > 80) {
        return { error: "Name must be 80 characters or fewer." };
    }
    if (fields.email) {
        fields.email = fields.email.toLowerCase();
        if (fields.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
            return { error: "Enter a valid email address." };
        }
    }
    if (fields.phone && (fields.phone.length > 25 || !/^\+?[0-9().\s-]{7,25}$/.test(fields.phone))) {
        return { error: "Enter a phone number between 7 and 25 characters." };
    }

    return { fields };
}

function handleError(res, error) {
    if (error.code === 11000) {
        return res.status(409).json({ message: "A user with that email already exists." });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: "User data is invalid." });
    }

    console.error("User request failed:", error.name, error.code || "");
    return res.status(500).json({ message: "An unexpected server error occurred." });
}

async function getAll(req, res) {
    const limit = parseInteger(req.query.limit, 50, 1, MAX_PAGE_SIZE);
    const skip = parseInteger(req.query.skip, 0, 0, 1000000);
    if (limit === null || skip === null) {
        return res.status(400).json({ message: `Use limit 1-${MAX_PAGE_SIZE} and a non-negative skip value.` });
    }

    try {
        const [users, total] = await Promise.all([
            User.find().sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean().exec(),
            User.countDocuments().exec()
        ]);
        return res.json({
            data: users,
            pagination: { limit, skip, total, hasMore: skip + users.length < total }
        });
    } catch (error) {
        return handleError(res, error);
    }
}

async function addUser(req, res) {
    const { fields, error } = readUserFields(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
        const user = await User.create(fields);
        return res.status(201).json(user);
    } catch (createError) {
        return handleError(res, createError);
    }
}

async function findUser(req, res, next) {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({ message: "User id must be a valid MongoDB ObjectId." });
    }

    try {
        const user = await User.findById(req.params.id).exec();
        if (!user) return res.status(404).json({ message: "User not found." });

        req.user = user;
        return next();
    } catch (error) {
        return handleError(res, error);
    }
}

function getOneUser(req, res) {
    return res.json(req.user);
}

async function deleteOneUser(req, res) {
    try {
        await req.user.deleteOne();
        return res.status(204).end();
    } catch (error) {
        return handleError(res, error);
    }
}

async function updateUser(req, res) {
    const { fields, error } = readUserFields(req.body, { partial: true });
    if (error) return res.status(400).json({ message: error });

    Object.assign(req.user, fields);
    try {
        const updatedUser = await req.user.save();
        return res.json(updatedUser);
    } catch (saveError) {
        return handleError(res, saveError);
    }
}

module.exports = { getAll, addUser, findUser, getOneUser, deleteOneUser, updateUser };
