const nodemailer = require("nodemailer");

// Create the SMTP transporter using environment configuration.
const createTransporter = () => {
    const port = Number(process.env.SMTP_PORT || 587);

    const secure = process.env.SMTP_SECURE === "true";

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Verify that the configured SMTP server can be reached.
const verifyMailerConnection = async () => {
    const transporter = createTransporter();

    await transporter.verify();

    return true;
};

module.exports = {
    createTransporter,
    verifyMailerConnection,
};
