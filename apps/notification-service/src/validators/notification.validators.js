const mongoose = require("mongoose");

const {
    allowedPriorities,
    allowedStatuses,
    allowedTypes,
} = require("../models/notification.model");

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate MongoDB notification IDs before controller logic runs.
const validateNotificationId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid notification ID.",
        });
    }

    return next();
};

// Validate notification creation requests.
const validateCreateNotification = (req, res, next) => {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
        ? req.body
        : {};
    const {
        type,
        recipient,
        subject,
        message,
        html,
        priority = "normal",
        scheduledAt,
    } = body;

    const errors = [];

    if (!allowedTypes.includes(type)) {
        errors.push(`type must be one of: ${allowedTypes.join(", ")}.`);
    }

    if (typeof recipient !== "string" || recipient.trim().length === 0) {
        errors.push("recipient is required.");
    }

    // Email notifications require a valid email recipient.
    if (
        type === "email" &&
        (typeof recipient !== "string" || !isValidEmail(recipient.trim()))
    ) {
        errors.push(
            "A valid email recipient is required for email notifications.",
        );
    }

    if (
        typeof subject !== "string" ||
        subject.trim().length < 2 ||
        subject.trim().length > 200
    ) {
        errors.push("subject must be between 2 and 200 characters.");
    }

    if (
        typeof message !== "string" ||
        message.trim().length < 1 ||
        message.trim().length > 5000
    ) {
        errors.push("message must be between 1 and 5000 characters.");
    }

    if (html !== undefined && html !== null && (typeof html !== "string" || html.length > 20000)) {
        errors.push("html must be a string of at most 20000 characters when provided.");
    }

    if (!allowedPriorities.includes(priority)) {
        errors.push(
            `priority must be one of: ${allowedPriorities.join(", ")}.`,
        );
    }

    if (scheduledAt !== undefined && scheduledAt !== null) {
        const scheduledDate = new Date(scheduledAt);

        if (Number.isNaN(scheduledDate.getTime())) {
            errors.push("scheduledAt must be a valid date.");
        } else if (scheduledDate <= new Date()) {
            errors.push("scheduledAt must be in the future.");
        }
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

// Validate bulk notification requests.
const validateBulkNotifications = (req, res, next) => {
    const notifications = req.body && typeof req.body === "object" && !Array.isArray(req.body)
        ? req.body.notifications
        : undefined;

    if (!Array.isArray(notifications) || notifications.length === 0) {
        return res.status(400).json({
            success: false,
            message: "notifications must be a non-empty array.",
        });
    }

    if (notifications.length > 50) {
        return res.status(400).json({
            success: false,
            message:
                "A maximum of 50 notifications can be created per request.",
        });
    }

    if (notifications.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
        return res.status(400).json({
            success: false,
            message: "Each notification must be a JSON object.",
        });
    }

    return next();
};

// Validate listing filters, sorting, and pagination.
const validateNotificationQuery = (req, res, next) => {
    const {
        search,
        recipient,
        type,
        status,
        priority,
        isRead,
        sort = "createdAt",
        order = "desc",
        page = "1",
        limit = "10",
    } = req.query;

    const errors = [];

    if (search !== undefined && (typeof search !== "string" || search.trim().length > 100)) {
        errors.push("search must be a string of at most 100 characters.");
    }

    if (recipient !== undefined && (typeof recipient !== "string" || recipient.trim().length > 254)) {
        errors.push("recipient must be a string of at most 254 characters.");
    }

    const allowedSortFields = [
        "recipient",
        "subject",
        "type",
        "status",
        "priority",
        "scheduledAt",
        "sentAt",
        "createdAt",
        "updatedAt",
    ];

    if (type !== undefined && !allowedTypes.includes(type)) {
        errors.push(`type must be one of: ${allowedTypes.join(", ")}.`);
    }

    if (status !== undefined && !allowedStatuses.includes(status)) {
        errors.push(`status must be one of: ${allowedStatuses.join(", ")}.`);
    }

    if (priority !== undefined && !allowedPriorities.includes(priority)) {
        errors.push(
            `priority must be one of: ${allowedPriorities.join(", ")}.`,
        );
    }

    if (isRead !== undefined && !["true", "false"].includes(isRead)) {
        errors.push("isRead must be either true or false.");
    }

    if (!allowedSortFields.includes(sort)) {
        errors.push(`sort must be one of: ${allowedSortFields.join(", ")}.`);
    }

    if (!["asc", "desc"].includes(order)) {
        errors.push("order must be either asc or desc.");
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
        errors.push("page must be a positive integer.");
    }

    if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100
    ) {
        errors.push("limit must be an integer between 1 and 100.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid query parameters.",
            errors,
        });
    }

    return next();
};

module.exports = {
    validateBulkNotifications,
    validateCreateNotification,
    validateNotificationId,
    validateNotificationQuery,
};
