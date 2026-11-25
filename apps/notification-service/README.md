# Notification Service

A practical ExpressJS backend for email and system notifications with MongoDB persistence, reusable templates, notification history, retries, scheduling, priorities, read state, filtering, pagination, and status tracking.

## Features

- Email notifications with Nodemailer
- System / in-app notifications
- Immediate notifications
- Scheduled notifications
- Bulk notifications
- Reusable email templates
- Notification priorities
- Pending, sent, failed, and scheduled status
- Delivery attempt tracking
- Failure reason tracking
- Retry failed notifications
- Notification history
- Search
- Recipient filtering
- Type filtering
- Status filtering
- Priority filtering
- Read / unread filtering
- Sorting
- Pagination
- Mark notification as read
- Mark notification as unread
- Mark all notifications for a recipient as read
- Delete notification history
- MongoDB persistence
- Mongoose validation
- Centralized error handling
- Graceful shutdown
- Health check endpoint
- Bearer API key protection for notification routes
- API testing with `requests.http`

## Tech Stack

- Node.js
- ExpressJS
- MongoDB
- Mongoose
- Nodemailer
- Nodemon

## Notification Types

```text
email
system
```

## Notification Statuses

```text
pending
sent
failed
scheduled
```

## Priorities

```text
low
normal
high
```

## API Endpoints

All `/api/v1/notifications` routes require `Authorization: Bearer <API_KEY>`. The root and health endpoints remain public for basic availability checks.

### Root

```http
GET /
```

### Health Check

```http
GET /api/v1/health
```

## Notifications

### Create Notification

```http
POST /api/v1/notifications
```

### Create Bulk Notifications

```http
POST /api/v1/notifications/bulk
```

### Get Notification History

```http
GET /api/v1/notifications
```

### Get Notification By ID

```http
GET /api/v1/notifications/:id
```

### Retry Failed Notification

```http
POST /api/v1/notifications/:id/retry
```

### Process Due Scheduled Notifications

```http
POST /api/v1/notifications/process-scheduled
```

### Mark Notification As Read

```http
PATCH /api/v1/notifications/:id/read
```

### Mark Notification As Unread

```http
PATCH /api/v1/notifications/:id/unread
```

### Mark All Recipient Notifications As Read

```http
PATCH /api/v1/notifications/mark-all-read
```

### Delete Notification

```http
DELETE /api/v1/notifications/:id
```

## Query Examples

### Pagination

```http
GET /api/v1/notifications?page=1&limit=5
```

### Search

```http
GET /api/v1/notifications?search=welcome
```

### Filter By Recipient

```http
GET /api/v1/notifications?recipient=user-001
```

### Filter By Type

```http
GET /api/v1/notifications?type=system
```

### Filter By Status

```http
GET /api/v1/notifications?status=sent
```

### Filter By Priority

```http
GET /api/v1/notifications?priority=high
```

### Filter Unread

```http
GET /api/v1/notifications?isRead=false
```

### Sorting

```http
GET /api/v1/notifications?sort=createdAt&order=desc
```

## Environment

Create a `.env` file using `.env.example`.

```env
PORT=1198
HOST=127.0.0.1
NODE_ENV=development
API_KEY=replace-with-a-random-64-character-hex-string

MONGODB_URI=mongodb://127.0.0.1:27017/notification_service

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

MAIL_FROM=Notification Service <notifications@example.com>
```

Generate a private API key with `node -p "require('node:crypto').randomBytes(32).toString('hex')"` and replace the placeholder. Keep the key private and send it only in the `Authorization` header. The server binds to `127.0.0.1` by default; configure `HOST=0.0.0.0` only when a container or hosting platform requires it.

## SMTP Configuration

Real email delivery requires valid SMTP credentials.

Without valid SMTP values:

- System notifications still work
- MongoDB history still works
- Filtering, pagination, read state, and scheduling still work
- Email delivery attempts can fail and remain available for retry testing

## Installation

```bash
npm ci
```

Requires Node.js 22.13 or newer in the 22.x line, or Node.js 24 or newer.

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

The API key is a shared service credential, not user authentication or per-recipient authorization. Do not expose this demo directly to the public internet; add identity, authorization, rate limiting, and HTTPS for a real multi-user service.

## Default Port

```text
1198
```

## Notification Flow

```text
Create Request
      |
      v
Validation
      |
      v
MongoDB Record
      |
      +----------------------+
      |                      |
 Immediate                Scheduled
      |                      |
      v                      v
Delivery Service        Wait Until Due
      |                      |
      v                      v
Email / System         Process Scheduled
      |
      v
Status Update
      |
      +--> sent
      |
      +--> failed
```

## Retry Flow

```text
Failed Notification
      |
      v
Retry Endpoint
      |
      v
Set Pending
      |
      v
Attempt Delivery
      |
      +--> Sent
      |
      +--> Failed Again
```

## Project Structure

```text
notification-service/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── mailer.js
│   ├── controllers/
│   │   └── notification.controllers.js
│   ├── middlewares/
│   │   ├── errorHandler.middleware.js
│   │   └── notFound.middleware.js
│   ├── models/
│   │   └── notification.model.js
│   ├── routes/
│   │   └── notification.routes.js
│   ├── services/
│   │   └── notification.service.js
│   ├── templates/
│   │   └── notification.templates.js
│   ├── validators/
│   │   └── notification.validators.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── requests.http
```

## Documentation

Detailed project and code documentation is available in `DOCUMENTATION.md`.

## Author

**Ashish Ranjan**

## Links

- Portfolio: https://www.ashishranjan.net
- GitHub: https://github.com/a2rp
- CodePen: https://codepen.io/ash1198
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- YouTube: https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1
- Email: mailto:ash.ranjan09@gmail.com

## Support

- Support: https://a2rp-donation-page.netlify.app/
- Buy Me A Coffee: https://buymeacoffee.com/a2rp
- Patreon: https://patreon.com/a2rp

## License

MIT License
