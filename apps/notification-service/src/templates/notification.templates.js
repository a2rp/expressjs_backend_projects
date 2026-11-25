const buildBasicEmailTemplate = ({ title, message, actionText, actionUrl }) => {
    const safeAction =
        actionText && actionUrl
            ? `
                <p style="margin: 24px 0 0;">
                    <a
                        href="${actionUrl}"
                        style="
                            display: inline-block;
                            padding: 12px 18px;
                            border-radius: 8px;
                            background: #111111;
                            color: #ffffff;
                            text-decoration: none;
                            font-weight: 700;
                        "
                    >
                        ${actionText}
                    </a>
                </p>
            `
            : "";

    return `
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
        </head>
        <body
            style="
                margin: 0;
                padding: 0;
                background: #f5f5f5;
                font-family: Arial, Helvetica, sans-serif;
                color: #111111;
            "
        >
            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="padding: 32px 16px;"
            >
                <tr>
                    <td align="center">
                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                                max-width: 640px;
                                background: #ffffff;
                                border-radius: 14px;
                                overflow: hidden;
                                border: 1px solid #e8e8e8;
                            "
                        >
                            <tr>
                                <td
                                    style="
                                        padding: 32px;
                                    "
                                >
                                    <p
                                        style="
                                            margin: 0 0 10px;
                                            font-size: 13px;
                                            font-weight: 700;
                                            letter-spacing: 1px;
                                            text-transform: uppercase;
                                            color: #666666;
                                        "
                                    >
                                        Notification Service
                                    </p>

                                    <h1
                                        style="
                                            margin: 0 0 18px;
                                            font-size: 28px;
                                            line-height: 1.25;
                                        "
                                    >
                                        ${title}
                                    </h1>

                                    <p
                                        style="
                                            margin: 0;
                                            font-size: 16px;
                                            line-height: 1.7;
                                            color: #333333;
                                        "
                                    >
                                        ${message}
                                    </p>

                                    ${safeAction}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
};

// Build a reusable welcome-style email.
const welcomeTemplate = ({ name = "there" }) => {
    return {
        subject: "Welcome",
        message: `Welcome ${name}. Your account is ready.`,
        html: buildBasicEmailTemplate({
            title: `Welcome ${name}`,
            message: "Your account is ready. We are glad to have you with us.",
        }),
    };
};

// Build a reusable security alert email.
const securityAlertTemplate = ({ message }) => {
    return {
        subject: "Security Alert",
        message,
        html: buildBasicEmailTemplate({
            title: "Security Alert",
            message,
        }),
    };
};

// Build a generic action email with an optional call-to-action button.
const actionTemplate = ({ subject, message, actionText, actionUrl }) => {
    return {
        subject,
        message,
        html: buildBasicEmailTemplate({
            title: subject,
            message,
            actionText,
            actionUrl,
        }),
    };
};

module.exports = {
    actionTemplate,
    buildBasicEmailTemplate,
    securityAlertTemplate,
    welcomeTemplate,
};
