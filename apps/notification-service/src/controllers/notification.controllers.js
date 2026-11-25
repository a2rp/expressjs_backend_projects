const { Notification } = require("../models/notification.model");

const {
    deliverNotification,
    processDueScheduledNotifications,
} = require("../services/notification.service");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Create one notification.
// Scheduled notifications are stored for later delivery.
// Immediate notifications are delivered right after creation.
const createNotification = async (req, res, next) => {
    try {
        const {
            type,
            recipient,
            subject,
            message,
            html = null,
            priority = "normal",
            scheduledAt = null,
        } = req.body;

        const isScheduled = scheduledAt !== null && scheduledAt !== undefined;

        const notification = await Notification.create({
            type,
            recipient: recipient.trim(),
            subject: subject.trim(),
            message: message.trim(),
            html,
            priority,
            scheduledAt: isScheduled ? new Date(scheduledAt) : null,
            status: isScheduled ? "scheduled" : "pending",
        });

        // Scheduled notifications are intentionally not delivered yet.
        if (isScheduled) {
            return res.status(201).json({
                success: true,
                message: "Notification scheduled successfully.",
                data: {
                    notification,
                },
            });
        }

        try {
            await deliverNotification(notification);

            return res.status(201).json({
                success: true,
                message: "Notification created and delivered successfully.",
                data: {
                    notification,
                },
            });
        } catch (deliveryError) {
            // The notification record remains available with failed status,
            // so delivery failures can be inspected and retried.
            return res.status(502).json({
                success: false,
                message: "Notification was created, but delivery failed.",
                data: {
                    notification,
                },
            });
        }
    } catch (error) {
        return next(error);
    }
};

// Create multiple notifications in one request.
// Each notification is processed independently.
const createBulkNotifications = async (req, res, next) => {
    try {
        const { notifications } = req.body;

        const results = [];

        for (const item of notifications) {
            try {
                const isScheduled =
                    item.scheduledAt !== null && item.scheduledAt !== undefined;

                const notification = await Notification.create({
                    type: item.type,
                    recipient: item.recipient.trim(),
                    subject: item.subject.trim(),
                    message: item.message.trim(),
                    html: item.html || null,
                    priority: item.priority || "normal",
                    scheduledAt: isScheduled
                        ? new Date(item.scheduledAt)
                        : null,
                    status: isScheduled ? "scheduled" : "pending",
                });

                if (!isScheduled) {
                    try {
                        await deliverNotification(notification);
                    } catch (error) {
                        // The failure is already stored on the notification.
                    }
                }

                results.push({
                    success: notification.status !== "failed",
                    notification,
                });
            } catch (error) {
                results.push({
                    success: false,
                    message: "Notification could not be processed.",
                });
            }
        }

        const successCount = results.filter((result) => result.success).length;

        const failureCount = results.length - successCount;

        return res.status(201).json({
            success: failureCount === 0,
            message: "Bulk notification processing completed.",
            data: {
                total: results.length,
                successCount,
                failureCount,
                results,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// List notification history with search, filters, sorting, and pagination.
const getNotifications = async (req, res, next) => {
    try {
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

        const filter = {};

        if (search) {
            const searchValue = escapeRegex(search.trim());

            filter.$or = [
                {
                    subject: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
                {
                    message: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
            ];
        }

        if (recipient) {
            filter.recipient = {
                $regex: escapeRegex(recipient.trim()),
                $options: "i",
            };
        }

        if (type) {
            filter.type = type;
        }

        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }

        if (isRead !== undefined) {
            filter.isRead = isRead === "true";
        }

        const sortMap = {
            recipient: "recipient",
            subject: "subject",
            type: "type",
            status: "status",
            priority: "priority",
            scheduledAt: "scheduledAt",
            sentAt: "sentAt",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        };

        const sortField = sortMap[sort] || "createdAt";

        const sortDirection = order === "asc" ? 1 : -1;

        const currentPage = Number(page);

        const pageLimit = Number(limit);

        const skip = (currentPage - 1) * pageLimit;

        const totalItems = await Notification.countDocuments(filter);

        const notifications = await Notification.find(filter)
            .sort({
                [sortField]: sortDirection,
            })
            .skip(skip)
            .limit(pageLimit)
            .lean();

        const totalPages =
            totalItems === 0 ? 0 : Math.ceil(totalItems / pageLimit);

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully.",
            data: notifications,
            pagination: {
                page: currentPage,
                limit: pageLimit,
                totalItems,
                totalPages,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Fetch one notification by MongoDB ID.
const getNotificationById = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification fetched successfully.",
            data: {
                notification,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Retry a failed notification.
const retryNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        if (notification.status !== "failed") {
            return res.status(400).json({
                success: false,
                message: "Only failed notifications can be retried.",
            });
        }

        notification.status = "pending";

        notification.failureReason = null;

        await notification.save();

        try {
            await deliverNotification(notification);

            return res.status(200).json({
                success: true,
                message: "Notification retried successfully.",
                data: {
                    notification,
                },
            });
        } catch (deliveryError) {
            return res.status(502).json({
                success: false,
                message: "Notification retry failed.",
                data: {
                    notification,
                },
            });
        }
    } catch (error) {
        return next(error);
    }
};

// Process all scheduled notifications that are due now.
const processScheduledNotifications = async (req, res, next) => {
    try {
        const results = await processDueScheduledNotifications();

        const successCount = results.filter((result) => result.success).length;

        const failureCount = results.length - successCount;

        return res.status(200).json({
            success: failureCount === 0,
            message: "Scheduled notification processing completed.",
            data: {
                processed: results.length,
                successCount,
                failureCount,
                results,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Mark one notification as read.
const markNotificationRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true,
                readAt: new Date(),
            },
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data: {
                notification,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Mark one notification as unread.
const markNotificationUnread = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            {
                isRead: false,
                readAt: null,
            },
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as unread.",
            data: {
                notification,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Mark all matching recipient notifications as read.
const markAllNotificationsRead = async (req, res, next) => {
    try {
        const { recipient } = req.body;

        if (typeof recipient !== "string" || recipient.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "recipient is required.",
            });
        }

        const result = await Notification.updateMany(
            {
                recipient: recipient.trim(),
                isRead: false,
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                },
            },
        );

        return res.status(200).json({
            success: true,
            message: "Notifications marked as read.",
            data: {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Delete one notification history record.
const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndDelete(
            req.params.id,
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully.",
            data: {
                id: notification._id,
            },
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
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
};
