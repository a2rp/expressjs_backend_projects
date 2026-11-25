const express = require("express");

const {
    createBulkNotifications,
    createNotification,
    deleteNotification,
    getNotificationById,
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    markNotificationUnread,
    processScheduledNotifications,
    retryNotification,
} = require("../controllers/notification.controllers");

const {
    validateBulkNotifications,
    validateCreateNotification,
    validateNotificationId,
    validateNotificationQuery,
} = require("../validators/notification.validators");

const router = express.Router();

// List notification history with search, filters, sorting, and pagination.
router.get("/", validateNotificationQuery, getNotifications);

// Fetch one notification by MongoDB ID.
router.get("/:id", validateNotificationId, getNotificationById);

// Create and immediately deliver or schedule one notification.
router.post("/", validateCreateNotification, createNotification);

// Create multiple notifications in one request.
router.post("/bulk", validateBulkNotifications, createBulkNotifications);

// Process every scheduled notification whose scheduled time has arrived.
router.post("/process-scheduled", processScheduledNotifications);

// Retry a previously failed notification.
router.post("/:id/retry", validateNotificationId, retryNotification);

// Mark one notification as read.
router.patch("/:id/read", validateNotificationId, markNotificationRead);

// Mark one notification as unread.
router.patch("/:id/unread", validateNotificationId, markNotificationUnread);

// Mark all unread notifications for a recipient as read.
router.patch("/mark-all-read", markAllNotificationsRead);

// Delete one notification history record.
router.delete("/:id", validateNotificationId, deleteNotification);

module.exports = router;
