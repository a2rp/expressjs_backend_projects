const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    const errors = [];

    // Validate the user's display name.
    if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 100
    ) {
        errors.push("Name must be between 2 and 100 characters.");
    }

    // Validate the email format before database access.
    if (typeof email !== "string" || !isValidEmail(email.trim())) {
        errors.push("A valid email address is required.");
    }

    // Require a practical minimum password length.
    if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 128
    ) {
        errors.push("Password must be between 8 and 128 characters.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors,
        });
    }

    return next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = [];

    if (typeof email !== "string" || !isValidEmail(email.trim())) {
        errors.push("A valid email address is required.");
    }

    if (typeof password !== "string" || password.length < 1) {
        errors.push("Password is required.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors,
        });
    }

    return next();
};

const validateEmailOnly = (req, res, next) => {
    const { email } = req.body;

    if (typeof email !== "string" || !isValidEmail(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "A valid email address is required.",
        });
    }

    return next();
};

const validateToken = (req, res, next) => {
    const { token } = req.body;

    if (typeof token !== "string" || token.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Token is required.",
        });
    }

    return next();
};

const validateResetPassword = (req, res, next) => {
    const { token, password } = req.body;

    const errors = [];

    if (typeof token !== "string" || token.trim().length === 0) {
        errors.push("Token is required.");
    }

    if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 128
    ) {
        errors.push("Password must be between 8 and 128 characters.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors,
        });
    }

    return next();
};

module.exports = {
    validateEmailOnly,
    validateLogin,
    validateRegister,
    validateResetPassword,
    validateToken,
};
