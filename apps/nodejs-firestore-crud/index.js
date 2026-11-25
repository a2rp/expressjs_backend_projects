require("dotenv").config();

const express = require("express");
const { usersDB } = require("./connect.db");

const app = express();
const PORT = Number(process.env.PORT || 1198);
const HOST = process.env.HOST || "127.0.0.1";

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
}

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

const asyncHandler = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};

function invalidInput(message) {
    const error = new Error(message);
    error.code = "INVALID_INPUT";
    return error;
}

function validateUserFields(body, { partial = false } = {}) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalidInput("A JSON object is required.");
    }

    const fields = {};
    const limits = { firstName: 100, lastName: 100, email: 254 };

    for (const [field, maxLength] of Object.entries(limits)) {
        const value = body[field];

        if (value === undefined && partial) {
            continue;
        }

        if (typeof value !== "string" || value.trim().length === 0 || value.trim().length > maxLength) {
            throw invalidInput(`${field} must be a non-empty string of at most ${maxLength} characters.`);
        }

        fields[field] = value.trim();
    }

    if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) {
        throw invalidInput("email must be a valid email address.");
    }

    if (partial && Object.keys(fields).length === 0) {
        throw invalidInput("At least one user field must be supplied.");
    }

    return fields;
}

function getDocumentId(value) {
    if (typeof value !== "string" || value.trim().length === 0 || value.includes("/")) {
        throw invalidInput("A valid user ID is required.");
    }

    return value.trim();
}

app.get("/api/v1/a2rp", (req, res) => {
    res.json({ success: true, message: "a2rp: an Ashish Ranjan presentation" });
});

app.post("/api/v1/create", asyncHandler(async (req, res) => {
    const user = validateUserFields(req.body);
    const document = usersDB.doc();
    await document.set(user);

    res.status(201).json({ success: true, user: { id: document.id, ...user } });
}));

app.get("/api/v1/users", asyncHandler(async (req, res) => {
    const snapshot = await usersDB.limit(100).get();
    const usersList = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));

    res.json({ success: true, usersList, limit: 100 });
}));

app.get("/api/v1/users/:id", asyncHandler(async (req, res) => {
    const id = getDocumentId(req.params.id);
    const document = await usersDB.doc(id).get();

    if (!document.exists) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, user: { id: document.id, ...document.data() } });
}));

app.patch("/api/v1/users/:id", asyncHandler(async (req, res) => {
    const id = getDocumentId(req.params.id);
    const fields = validateUserFields(req.body, { partial: true });
    const documentRef = usersDB.doc(id);
    const existingDocument = await documentRef.get();

    if (!existingDocument.exists) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    await documentRef.update(fields);
    const updatedDocument = await documentRef.get();

    res.json({ success: true, user: { id: updatedDocument.id, ...updatedDocument.data() } });
}));

app.delete("/api/v1/users/:id", asyncHandler(async (req, res) => {
    const id = getDocumentId(req.params.id);
    const documentRef = usersDB.doc(id);
    const existingDocument = await documentRef.get();

    if (!existingDocument.exists) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    await documentRef.delete();
    res.status(204).end();
}));

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const isMalformedJson = error.type === "entity.parse.failed";
    const isOversizedBody = error.type === "entity.too.large";
    const isInvalidInput = error.code === "INVALID_INPUT";
    const status = isMalformedJson ? 400 : isOversizedBody ? 413 : isInvalidInput ? 400 : 500;
    const message = isMalformedJson
        ? "Invalid JSON request body."
        : isOversizedBody
            ? "Request body too large."
            : isInvalidInput
                ? error.message
                : "Internal server error.";

    if (status === 500) {
        console.error("Firestore request failed:", error.name || "Error");
    }

    res.status(status).json({ success: false, message });
});

app.listen(PORT, HOST, () => console.log(`Firestore API listening at http://${HOST}:${PORT}`));
