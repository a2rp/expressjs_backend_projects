const mongoose = require("mongoose");

const allowedTypes = ["email", "system"];

const allowedStatuses = ["pending", "sent", "failed", "scheduled"];

const allowedPriorities = ["low", "normal", "high"];

const notificationSchema = new mongoose.Schema(
    {
        // Notification channel/type.
        type: {
            type: String,
            enum: allowedTypes,
            required: true,
            index: true,
        },

        // Recipient address or identifier.
        recipient: {
            type: String,
            required: true,
            trim: true,
            maxlength: 254,
            index: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        // Plain-text notification content.
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },

        // Optional HTML version used mainly for email delivery.
        html: {
            type: String,
            default: null,
            maxlength: 20000,
        },

        priority: {
            type: String,
            enum: allowedPriorities,
            default: "normal",
            index: true,
        },

        status: {
            type: String,
            enum: allowedStatuses,
            default: "pending",
            index: true,
        },

        // Scheduled notifications wait until this time before delivery.
        scheduledAt: {
            type: Date,
            default: null,
            index: true,
        },

        // Actual successful delivery timestamp.
        sentAt: {
            type: Date,
            default: null,
        },

        // Store the most recent delivery failure message.
        failureReason: {
            type: String,
            default: null,
        },

        // Track how many delivery attempts were made.
        attempts: {
            type: Number,
            default: 0,
            min: 0,
        },

        // System/in-app notifications can be marked as read.
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// Supports common history queries by status and creation time.
notificationSchema.index({
    status: 1,
    createdAt: -1,
});

// Supports scheduled-delivery lookups.
notificationSchema.index({
    status: 1,
    scheduledAt: 1,
});

// Supports unread notification queries.
notificationSchema.index({
    recipient: 1,
    isRead: 1,
    createdAt: -1,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = {
    Notification,
    allowedPriorities,
    allowedStatuses,
    allowedTypes,
};
