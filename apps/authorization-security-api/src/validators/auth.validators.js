const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate registration input before creating a user.
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    const errors = [];

    if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 100
    ) {
        errors.push("Name must be between 2 and 100 characters.");
    }

    if (typeof email !== "string" || !isValidEmail(email.trim())) {
        errors.push("A valid email address is required.");
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

// Validate login credentials before authentication logic runs.
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

module.exports = {
    validateLogin,
    validateRegister,
};
