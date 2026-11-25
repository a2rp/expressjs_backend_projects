const { createTransporter } = require("../config/mailer");

const { Notification } = require("../models/notification.model");

// Send one email notification through Nodemailer.
const sendEmailNotification = async (notification) => {
    const transporter = createTransporter();

    notification.attempts += 1;

    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.SMTP_USER,
            to: notification.recipient,
            subject: notification.subject,
            text: notification.message,
            html: notification.html || undefined,
        });

        notification.status = "sent";
        notification.sentAt = new Date();
        notification.failureReason = null;

        await notification.save();

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        notification.status = "failed";

        notification.failureReason = error.code
            ? `Email delivery failed (${error.code}).`
            : "Email delivery failed.";

        await notification.save();

        throw error;
    }
};

// Process one notification according to its type.
const deliverNotification = async (notification) => {
    if (notification.type === "email") {
        return sendEmailNotification(notification);
    }

    // System/in-app notifications are considered delivered
    // as soon as their database record is created.
    if (notification.type === "system") {
        notification.status = "sent";

        notification.sentAt = new Date();

        notification.attempts += 1;

        notification.failureReason = null;

        await notification.save();

        return {
            success: true,
        };
    }

    throw new Error("Unsupported notification type.");
};

// Deliver all scheduled notifications whose scheduled time has arrived.
const processDueScheduledNotifications = async () => {
    const now = new Date();

    const notifications = await Notification.find({
        status: "scheduled",
        scheduledAt: {
            $lte: now,
        },
    }).sort({
        scheduledAt: 1,
    });

    const results = [];

    for (const notification of notifications) {
        try {
            await deliverNotification(notification);

            results.push({
                id: notification._id,
                success: true,
            });
        } catch (error) {
            results.push({
                id: notification._id,
                success: false,
                message: "Notification delivery failed.",
            });
        }
    }

    return results;
};

module.exports = {
    deliverNotification,
    processDueScheduledNotifications,
    sendEmailNotification,
};
