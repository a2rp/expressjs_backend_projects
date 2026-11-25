# Notification Service - Documentation

## 1. Overview

Notification Service is a backend project built with Node.js, ExpressJS, MongoDB, Mongoose, and Nodemailer.

The project demonstrates a notification management architecture including:

- Email notifications
- System / in-app notifications
- Immediate delivery
- Scheduled delivery
- Bulk notifications
- Reusable email templates
- Notification history
- Delivery status tracking
- Delivery attempt tracking
- Failure tracking
- Retry support
- Priority levels
- Read / unread state
- Search
- Filtering
- Sorting
- Pagination
- Centralized error handling
- Graceful shutdown

The service separates notification persistence from notification delivery so that notification records remain available even when delivery fails.

---

# 2. Technology Stack

## Node.js

Node.js provides the backend runtime.

It handles:

- Application execution
- Asynchronous notification delivery
- Process lifecycle events
- SMTP communication
- MongoDB communication

## ExpressJS

ExpressJS provides:

- API routing
- Middleware
- JSON request parsing
- HTTP responses
- Error handling

## MongoDB

MongoDB stores notification records and their lifecycle information.

Examples include:

- Recipient
- Subject
- Message
- Type
- Priority
- Status
- Scheduled time
- Delivery time
- Failure reason
- Delivery attempts
- Read state

## Mongoose

Mongoose provides:

- Notification schema
- Data validation
- Indexes
- MongoDB queries
- Document models

## Nodemailer

Nodemailer provides SMTP-based email delivery.

It is responsible for sending email notifications through the configured SMTP provider.

---

# 3. Project Architecture

The high-level architecture is:

```text
Client
   |
   v
ExpressJS API
   |
   v
Validation
   |
   v
Notification Controller
   |
   +----------------------+
   |                      |
   v                      v
MongoDB              Delivery Service
                          |
                    +-----+------+
                    |            |
                    v            v
                  Email        System
                    |
                    v
                   SMTP
```

MongoDB keeps the notification history while the delivery service handles notification processing.

---

# 4. Project Structure

```text
notification-service/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── mailer.js
│   ├── controllers/
│   │   └── notification.controllers.js
│   ├── middlewares/
│   │   ├── apiKey.middleware.js
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
├── .env
├── .env.example
├── .gitignore
├── DOCUMENTATION.md
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
└── requests.http
```

---

# 5. `src/server.js`

`server.js` is the application entry point.

It is responsible for:

- Loading environment variables
- Connecting to MongoDB
- Starting the ExpressJS server
- Displaying local API URLs
- Handling process signals
- Graceful shutdown
- Unexpected promise rejection handling
- Uncaught exception handling

The application starts listening only after MongoDB connects successfully.

---

# 6. Server Startup Flow

```text
npm run dev
     |
     v
Load .env
     |
     v
Connect MongoDB
     |
     v
Start ExpressJS
     |
     v
Listen On Port 1198
```

If MongoDB cannot connect, application startup fails instead of running with an unavailable database.

---

# 7. Graceful Shutdown

The application handles:

```text
SIGINT
SIGTERM
```

The shutdown sequence is:

```text
Shutdown Signal
      |
      v
Stop HTTP Server
      |
      v
Close MongoDB Connection
      |
      v
Exit Process
```

This prevents the application from abruptly terminating active resources during a normal shutdown.

---

# 8. `src/config/database.js`

This module manages MongoDB connectivity.

The connection URI comes from:

```env
MONGODB_URI
```

Default local configuration:

```text
mongodb://127.0.0.1:27017/notification_service
```

Database connection logic is separated from the server and controllers.

---

# 9. `src/config/mailer.js`

This module creates the Nodemailer SMTP transporter.

It uses:

```env
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
```

The transporter is responsible for communicating with the SMTP server.

---

# 10. SMTP

SMTP stands for:

```text
Simple Mail Transfer Protocol
```

It is commonly used to transfer outgoing email.

The notification service itself does not operate as a complete mail server.

Instead:

```text
Notification Service
        |
        v
    Nodemailer
        |
        v
    SMTP Server
        |
        v
Recipient Mailbox
```

---

# 11. SMTP Configuration

Example:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

The actual values depend on the SMTP provider.

Credentials should never be hard-coded into application source files.

---

# 12. `SMTP_SECURE`

The application converts:

```env
SMTP_SECURE=true
```

into the Boolean:

```js
true;
```

and any other value into:

```js
false;
```

The appropriate value depends on the SMTP connection configuration.

---

# 13. Mail Sender

The sender is configured through:

```env
MAIL_FROM
```

Example:

```env
MAIL_FROM=Notification Service <notifications@example.com>
```

If `MAIL_FROM` is not available, the service falls back to:

```env
SMTP_USER
```

---

# 14. Mailer Verification

The mailer configuration provides a helper that can verify the SMTP connection.

Conceptually:

```text
SMTP Configuration
      |
      v
Create Transporter
      |
      v
Verify Connection
```

This can be useful when checking SMTP configuration independently from actual message delivery.

---

# 15. Notification Model

File:

```text
src/models/notification.model.js
```

The notification model represents a stored notification.

Important fields include:

```text
type
recipient
subject
message
html
priority
status
scheduledAt
sentAt
failureReason
attempts
isRead
readAt
createdAt
updatedAt
```

---

# 16. Notification Types

Supported types:

```text
email
system
```

## Email

An email notification is delivered using Nodemailer and SMTP.

## System

A system notification represents an in-app or application-level notification.

In the current project, creating the database notification record represents the system notification's delivery mechanism.

---

# 17. Notification Statuses

Supported statuses:

```text
pending
sent
failed
scheduled
```

## `pending`

The notification exists and is waiting for delivery processing.

## `sent`

The notification has been successfully processed.

## `failed`

A delivery attempt failed.

## `scheduled`

The notification is waiting until its scheduled time.

---

# 18. Notification Priority

Supported priorities:

```text
low
normal
high
```

Default:

```text
normal
```

Priority can be used by clients to distinguish the importance of notifications.

---

# 19. Recipient

The `recipient` field identifies who should receive the notification.

For email notifications it must contain a valid email address.

Example:

```text
user@example.com
```

For system notifications it can contain an application-specific identifier.

Example:

```text
user-001
```

---

# 20. Subject

The subject describes the notification.

Maximum length:

```text
200 characters
```

For email notifications this becomes the email subject.

For system notifications it acts as the notification title.

---

# 21. Message

The `message` field stores plain-text notification content.

Maximum length:

```text
5000 characters
```

For email notifications it is also used as the plain-text email body.

---

# 22. HTML Content

The optional:

```text
html
```

field can contain an HTML version of an email.

If HTML is not supplied, Nodemailer still sends the plain-text message.

---

# 23. Scheduled Time

The optional:

```text
scheduledAt
```

field stores when a notification should become eligible for delivery.

If no scheduled time is provided, the notification is processed immediately.

---

# 24. Sent Time

The field:

```text
sentAt
```

records the time of successful notification delivery.

It remains:

```text
null
```

until the notification is successfully processed.

---

# 25. Failure Reason

When delivery fails:

```text
failureReason
```

stores the latest error message.

This allows failed notifications to be inspected later.

---

# 26. Delivery Attempts

The field:

```text
attempts
```

counts delivery attempts.

Initial value:

```text
0
```

Each delivery attempt increments this number.

This is useful for retry tracking.

---

# 27. Read State

The field:

```text
isRead
```

tracks whether the notification has been marked as read.

Default:

```text
false
```

The field:

```text
readAt
```

records when it was marked as read.

---

# 28. Model Indexes

The model contains indexes for common queries.

Examples include:

```text
status + createdAt
status + scheduledAt
recipient + isRead + createdAt
```

These indexes support notification history, scheduled processing, and unread notification queries.

---

# 29. Notification Templates

File:

```text
src/templates/notification.templates.js
```

The project includes reusable email template helpers.

These include:

```text
buildBasicEmailTemplate
welcomeTemplate
securityAlertTemplate
actionTemplate
```

---

# 30. Why Templates Are Useful

Without templates, HTML email markup may be duplicated throughout controllers or services.

Templates separate presentation from delivery logic.

Architecture:

```text
Application Data
      |
      v
Template
      |
      v
HTML + Text
      |
      v
Notification Service
      |
      v
Email
```

---

# 31. Basic Email Template

`buildBasicEmailTemplate()` creates a reusable HTML email structure.

It supports:

- Title
- Message
- Optional action text
- Optional action URL

When action information is provided, an email button is generated.

---

# 32. Welcome Template

The welcome template returns:

```text
subject
message
html
```

Example concept:

```text
Welcome Ashish
Your account is ready.
```

---

# 33. Security Alert Template

The security alert template can be used for notifications such as:

```text
New login detected
Password changed
Security setting updated
```

It produces both plain-text and HTML content.

---

# 34. Action Template

The action template accepts:

```text
subject
message
actionText
actionUrl
```

It can be used for emails requiring a call-to-action button.

---

# 35. Notification Service Layer

File:

```text
src/services/notification.service.js
```

The service layer contains delivery logic.

It separates:

```text
HTTP/controller logic
```

from:

```text
notification delivery logic
```

This keeps controllers focused on API behavior.

---

# 36. Email Delivery

Email delivery uses:

```text
transporter.sendMail()
```

The message contains:

```text
from
to
subject
text
html
```

---

# 37. Email Delivery Flow

```text
Notification Record
      |
      v
Create SMTP Transporter
      |
      v
Increment Attempts
      |
      v
Send Email
      |
   +--+--+
   |     |
Success Failure
   |     |
   v     v
 sent   failed
   |     |
   v     v
sentAt failureReason
```

---

# 38. Successful Email Delivery

After successful delivery:

```text
status = sent
sentAt = current time
failureReason = null
```

The notification is then saved to MongoDB.

---

# 39. Failed Email Delivery

If Nodemailer throws an error:

```text
status = failed
failureReason = error.message
```

The failed notification is still saved.

This is important because a failed delivery should not erase the notification history.

---

# 40. System Notification Delivery

System notifications do not use SMTP.

The service marks them as:

```text
sent
```

and records:

```text
sentAt
```

The attempt counter is also incremented.

This simulates an in-app notification being available after database persistence.

---

# 41. Scheduled Notification Processing

Scheduled notifications have:

```text
status = scheduled
```

and:

```text
scheduledAt
```

The processing service searches for:

```text
status = scheduled
scheduledAt <= current time
```

Only notifications that are due are processed.

---

# 42. Scheduled Processing Flow

```text
Scheduled Records
      |
      v
scheduledAt <= now?
      |
   +--+--+
   |     |
  No    Yes
   |     |
 Wait    v
      Deliver
         |
      +--+--+
      |     |
     sent failed
```

---

# 43. Scheduled Processing Endpoint

Endpoint:

```http
POST /api/v1/notifications/process-scheduled
```

This triggers processing of currently due scheduled notifications.

The response reports:

```text
processed
successCount
failureCount
results
```

---

# 44. Important Scheduling Scope

The current project demonstrates scheduling logic through an API-triggered scheduled processor.

It does not include a permanent background worker or cron scheduler.

That means:

```text
scheduledAt
```

determines eligibility, but the processing endpoint must be executed to process due notifications.

Dedicated background job processing belongs naturally in a separate background-jobs architecture.

---

# 45. Create Notification

Endpoint:

```http
POST /api/v1/notifications
```

The request can create:

- Immediate system notification
- Immediate email notification
- Scheduled system notification
- Scheduled email notification

---

# 46. Immediate Notification Flow

```text
POST Request
     |
     v
Validate
     |
     v
Create MongoDB Record
     |
     v
status = pending
     |
     v
Deliver
     |
  +--+--+
  |     |
sent  failed
```

---

# 47. Scheduled Notification Flow

```text
POST Request
     |
     v
Validate Future scheduledAt
     |
     v
Create MongoDB Record
     |
     v
status = scheduled
     |
     v
Return 201
```

No immediate delivery attempt occurs.

---

# 48. Failed Immediate Delivery

An important design decision is that the MongoDB record is created before immediate delivery.

If email delivery fails:

```text
MongoDB Record
     |
     v
Delivery Attempt
     |
     v
Failure
     |
     v
status = failed
```

The API can then expose that failed record for inspection and retry.

---

# 49. HTTP 502 For Delivery Failure

When an immediate delivery attempt fails after the record has already been created, the API returns:

```text
502
```

The response explains that the notification was created but delivery failed.

The failed notification record remains available.

---

# 50. Bulk Notifications

Endpoint:

```http
POST /api/v1/notifications/bulk
```

A request contains:

```json
{
    "notifications": []
}
```

The current maximum is:

```text
50 notifications per request
```

---

# 51. Bulk Processing

Each notification is processed independently.

Conceptually:

```text
Bulk Request
     |
     v
Notification 1 -> process
Notification 2 -> process
Notification 3 -> process
     |
     v
Collect Results
```

One failed notification does not automatically stop processing the remaining items.

---

# 52. Bulk Response

The response includes:

```text
total
successCount
failureCount
results
```

This provides visibility into partial failures.

---

# 53. Notification History

Endpoint:

```http
GET /api/v1/notifications
```

The endpoint supports:

- Search
- Recipient filtering
- Type filtering
- Status filtering
- Priority filtering
- Read-state filtering
- Sorting
- Pagination

---

# 54. Search

Example:

```http
GET /api/v1/notifications?search=welcome
```

Search checks:

```text
subject
message
```

using case-insensitive matching.

---

# 55. Recipient Filtering

Example:

```http
GET /api/v1/notifications?recipient=user-001
```

Recipient filtering uses case-insensitive matching.

---

# 56. Type Filtering

Example:

```http
GET /api/v1/notifications?type=system
```

Supported values:

```text
email
system
```

---

# 57. Status Filtering

Example:

```http
GET /api/v1/notifications?status=sent
```

Supported values:

```text
pending
sent
failed
scheduled
```

---

# 58. Priority Filtering

Example:

```http
GET /api/v1/notifications?priority=high
```

Supported values:

```text
low
normal
high
```

---

# 59. Read-State Filtering

Example:

```http
GET /api/v1/notifications?isRead=false
```

Supported values:

```text
true
false
```

---

# 60. Sorting

Example:

```http
GET /api/v1/notifications?sort=createdAt&order=desc
```

Supported sort fields include:

```text
recipient
subject
type
status
priority
scheduledAt
sentAt
createdAt
updatedAt
```

Order supports:

```text
asc
desc
```

---

# 61. Pagination

Example:

```http
GET /api/v1/notifications?page=2&limit=5
```

Skip is calculated as:

```text
(page - 1) × limit
```

Example:

```text
page = 3
limit = 5

skip = 10
```

---

# 62. Pagination Response

Example:

```json
{
    "page": 1,
    "limit": 10,
    "totalItems": 25,
    "totalPages": 3
}
```

The maximum accepted limit is:

```text
100
```

---

# 63. Get Notification By ID

Endpoint:

```http
GET /api/v1/notifications/:id
```

The notification ID is validated before querying MongoDB.

If the record does not exist:

```text
404 Not Found
```

is returned.

---

# 64. Notification ID Validation

The service validates MongoDB ObjectIds using Mongoose.

Example invalid ID:

```text
invalid-id
```

returns:

```text
400 Bad Request
```

instead of sending an invalid identifier to the database query.

---

# 65. Retry Failed Notification

Endpoint:

```http
POST /api/v1/notifications/:id/retry
```

Only notifications with:

```text
status = failed
```

can be retried.

---

# 66. Retry Flow

```text
Failed Notification
      |
      v
Retry Request
      |
      v
status = pending
failureReason = null
      |
      v
Deliver Again
      |
   +--+--+
   |     |
 sent  failed
```

The attempt counter increases again during the delivery attempt.

---

# 67. Retry Restriction

Trying to retry a notification that is:

```text
sent
pending
scheduled
```

returns:

```text
400 Bad Request
```

This prevents unnecessary retries of notifications that are not in a failed state.

---

# 68. Mark Notification As Read

Endpoint:

```http
PATCH /api/v1/notifications/:id/read
```

The service updates:

```text
isRead = true
readAt = current time
```

---

# 69. Mark Notification As Unread

Endpoint:

```http
PATCH /api/v1/notifications/:id/unread
```

The service updates:

```text
isRead = false
readAt = null
```

---

# 70. Mark All As Read

Endpoint:

```http
PATCH /api/v1/notifications/mark-all-read
```

Request:

```json
{
    "recipient": "user-001"
}
```

The service updates all unread notifications matching that recipient.

---

# 71. Mark-All Response

The response contains:

```text
matchedCount
modifiedCount
```

This shows how many records matched and how many were changed.

---

# 72. Delete Notification

Endpoint:

```http
DELETE /api/v1/notifications/:id
```

This deletes the MongoDB notification history record.

It does not reverse an email that has already been delivered.

---

# 73. Request Validation

File:

```text
src/validators/notification.validators.js
```

The validation layer checks:

- Notification type
- Recipient
- Email format
- Subject
- Message
- HTML type
- Priority
- Scheduled date
- Bulk request size
- Notification ID
- Filters
- Sorting
- Pagination

---

# 74. Email Validation

For:

```text
type = email
```

the recipient must look like a valid email address.

Example accepted format:

```text
user@example.com
```

Example invalid value:

```text
invalid-email
```

---

# 75. Scheduled Date Validation

If:

```text
scheduledAt
```

is provided, it must:

1. Be a valid date
2. Be in the future

Past dates are rejected.

---

# 76. Bulk Validation

Bulk requests must contain a non-empty:

```text
notifications
```

array.

Maximum:

```text
50
```

items per request.

---

# 77. Query Validation

The history endpoint validates:

```text
type
status
priority
isRead
sort
order
page
limit
```

This prevents unsupported values from silently producing confusing results.

---

# 78. Centralized Error Handling

File:

```text
src/middlewares/errorHandler.middleware.js
```

It handles common application failures such as:

- MongoDB ObjectId cast errors
- Mongoose validation errors
- Duplicate database values
- SMTP authentication failures
- SMTP connection failures
- Custom application errors
- Unexpected server errors

---

# 79. SMTP Authentication Failure

Common SMTP authentication failures include:

```text
EAUTH
```

or SMTP response code:

```text
535
```

The error middleware converts these into a consistent API response.

---

# 80. SMTP Connection Failure

Examples include:

```text
ECONNECTION
ETIMEDOUT
ECONNREFUSED
```

These are converted into a notification delivery service unavailable response.

---

# 81. 404 Middleware

File:

```text
src/middlewares/notFound.middleware.js
```

Unknown routes return:

```text
404
```

with:

```text
success
message
method
path
```

Example:

```http
GET /api/v1/not-found
```

---

# 82. `src/app.js`

The ExpressJS application configures:

```text
JSON parser
Root endpoint
Health endpoint
Notification routes
404 middleware
Central error handler
```

---

# 83. JSON Body Limit

The application configures:

```text
100kb
```

as the JSON body limit.

This places a basic restriction on oversized JSON requests.

---

# 84. Middleware Order

The application flow is:

```text
Request
   |
   v
JSON Parser
   |
   v
Routes
   |
   v
404 Handler
   |
   v
Central Error Handler
```

The centralized error handler remains last.

---

# 85. Root Endpoint

Endpoint:

```http
GET /
```

This confirms that the service is running.

---

# 86. Health Endpoint

Endpoint:

```http
GET /api/v1/health
```

The response includes:

```text
status
service
version
uptime
timestamp
```

---

# 87. Environment Variables

The project uses:

```env
PORT
HOST
NODE_ENV
API_KEY
MONGODB_URI
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
MAIL_FROM
```

These values keep environment-specific configuration outside source code.

---

# 88. `.env`

The real `.env` contains local or secret configuration.

It must not be committed to Git.

Example:

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

---

# 89. `.env.example`

`.env.example` documents the environment variables required by the project.

It should contain placeholders rather than real SMTP credentials.

This file can safely be committed.

---

# 90. `.gitignore`

The project ignores:

```text
node_modules/
.env
debug logs
OS-generated files
editor settings
```

This prevents dependencies and secrets from being committed.

---

# 91. `requests.http`

The project includes a complete API testing file.

It covers:

- Root
- Health
- Immediate system notification
- High-priority notification
- Scheduled notification
- Email notification
- HTML email
- Scheduled email
- Bulk notifications
- History
- Pagination
- Search
- Recipient filtering
- Type filtering
- Status filtering
- Priority filtering
- Read filtering
- Sorting
- Combined queries
- Get by ID
- Read
- Unread
- Mark all read
- Scheduled processing
- Retry
- Delete
- Validation failures
- Invalid route

---

# 92. System Notification Example

Request:

```http
POST /api/v1/notifications
Content-Type: application/json
```

Body:

```json
{
    "type": "system",
    "recipient": "user-001",
    "subject": "Welcome",
    "message": "Welcome to the notification service.",
    "priority": "normal"
}
```

Expected lifecycle:

```text
Create Record
     |
     v
pending
     |
     v
System Delivery
     |
     v
sent
```

---

# 93. Email Notification Example

Request body:

```json
{
    "type": "email",
    "recipient": "recipient@example.com",
    "subject": "Email Notification Test",
    "message": "This is an email notification.",
    "priority": "normal"
}
```

With valid SMTP configuration:

```text
Create Record
     |
     v
Send Through SMTP
     |
     v
sent
```

Without valid SMTP configuration:

```text
Create Record
     |
     v
SMTP Failure
     |
     v
failed
     |
     v
Available For Retry
```

---

# 94. Scheduled Notification Example

Request:

```json
{
    "type": "system",
    "recipient": "user-001",
    "subject": "Scheduled Reminder",
    "message": "Scheduled notification.",
    "scheduledAt": "2026-08-18T10:00:00.000Z"
}
```

Initial status:

```text
scheduled
```

Once the scheduled time has passed, calling:

```http
POST /api/v1/notifications/process-scheduled
```

makes the notification eligible for delivery.

---

# 95. Status Lifecycle

A normal immediate notification can follow:

```text
pending
   |
   +--> sent
   |
   +--> failed
```

A scheduled notification follows:

```text
scheduled
    |
    v
delivery attempt
    |
 +--+--+
 |     |
sent failed
```

A failed notification can follow:

```text
failed
  |
  v
retry
  |
  v
pending
  |
 +--+--+
 |     |
sent failed
```

---

# 96. Read-State Lifecycle

Read state is independent of delivery status.

For example, a notification can be:

```text
status = sent
isRead = false
```

and later:

```text
status = sent
isRead = true
```

This separation is useful for system/in-app notification interfaces.

---

# 97. Persistence vs Delivery

A major concept demonstrated by this project is the difference between:

```text
Notification persistence
```

and:

```text
Notification delivery
```

Persistence answers:

```text
What notification exists?
What happened to it?
Was it sent?
Did it fail?
How many attempts occurred?
```

Delivery answers:

```text
How does the notification reach its destination?
```

Separating these responsibilities makes failures easier to track and retry.

---

# 98. Failure Tracking

The service does not simply discard failed email attempts.

Instead it stores:

```text
status = failed
failureReason
attempts
```

This provides useful operational information.

---

# 99. Retry Architecture

Retry support demonstrates an important backend pattern.

Instead of requiring the client to recreate a failed notification:

```text
Existing Failed Record
      |
      v
Retry Endpoint
      |
      v
Delivery Service
```

The original notification record remains the source of the retry.

---

# 100. Bulk Processing Strategy

Bulk processing is intentionally independent per item.

This means:

```text
Notification A succeeds
Notification B fails
Notification C succeeds
```

can still produce a complete response describing all three outcomes.

This is more useful than abandoning the entire batch after the first failure.

---

# 101. Scheduling Architecture

The repository stores scheduling information in MongoDB.

The processing logic determines due notifications using:

```text
scheduledAt <= now
```

This demonstrates the core scheduling data model without introducing a separate queue or cron infrastructure.

---

# 102. Production Considerations

A larger production notification platform may additionally require:

- Background job queues
- Redis
- BullMQ or similar queue systems
- Dedicated workers
- Automatic retry policies
- Exponential backoff
- Dead-letter queues
- SMS providers
- Push notification providers
- Web push
- User notification preferences
- Email unsubscribe handling
- Provider webhooks
- Delivery receipts
- Bounce handling
- Template versioning
- Provider failover
- Rate limiting
- Idempotency
- Audit logs
- Metrics and tracing

Those concerns are intentionally outside this repository's focused scope.

---

# 103. Why Background Workers Are Not Included

This repository focuses specifically on notification service concepts.

Dedicated background job infrastructure is a separate backend concern.

The current project therefore demonstrates:

```text
scheduled notification persistence
+
due notification processing
```

without building a complete worker system.

This keeps responsibilities clear between portfolio projects.

---

# 104. Security Considerations

The project demonstrates basic security-conscious practices:

- SMTP credentials stored in environment variables
- Notification routes require a private bearer API key with at least 32 bytes
- The server binds to `127.0.0.1` by default
- `.env` ignored by Git
- Request validation
- Email validation
- JSON body limit
- Restricted notification types
- Restricted priorities
- Restricted status filters
- Pagination limits
- Centralized error handling

A shared API key protects service-to-service access, but it does not provide user identity or per-recipient authorization. Do not expose this demo directly to the public internet. A real multi-user deployment needs user authentication, authorization, rate limiting, HTTPS, and secret storage through the hosting platform.

Generate the API key with `node -p "require('node:crypto').randomBytes(32).toString('hex')"`. Include it as `Authorization: Bearer <API_KEY>` on every `/api/v1/notifications` request. The root and health endpoints do not require the key.

---

# 105. API Status Codes

Important status codes include:

```text
200 OK
Successful reads, updates, retries, scheduled processing, or deletes

201 Created
Notification or bulk notification creation

400 Bad Request
Invalid input, query, ID, retry state, or schedule

404 Not Found
Notification or route does not exist

409 Conflict
Database uniqueness conflict

502 Bad Gateway
Notification delivery or SMTP-related failure

500 Internal Server Error
Unexpected application failure
```

---

# 106. Local Development

Install dependencies:

```bash
npm install
```

Ensure MongoDB is running.

Start the development server:

```bash
npm run dev
```

Default URL:

```text
http://localhost:1198
```

---

# 107. Production Start

Run:

```bash
npm start
```

This starts:

```text
node src/server.js
```

without Nodemon.

---

# 108. Testing Without SMTP

The service can still be meaningfully tested without valid SMTP credentials.

You can test:

- System notifications
- Scheduling
- Bulk system notifications
- Notification history
- Search
- Filters
- Sorting
- Pagination
- Read state
- Delete
- Validation
- Failed email persistence
- Retry behavior

Actual successful email delivery requires valid SMTP configuration.

---

# 109. Main Concepts Demonstrated

After studying this project, the following concepts should be clear:

- Notification service architecture
- Notification persistence
- Email delivery
- SMTP
- Nodemailer
- System notifications
- Reusable templates
- Immediate delivery
- Scheduled notifications
- Bulk processing
- Delivery status
- Failure tracking
- Retry logic
- Attempt counters
- Priority levels
- Read / unread state
- Notification history
- Search
- Filtering
- Sorting
- Pagination
- Request validation
- MongoDB indexes
- Centralized error handling
- Graceful shutdown

---

# 110. Complete Notification Lifecycle

```text
Client
  |
  v
API Request
  |
  v
Validation
  |
  v
MongoDB Notification
  |
  +---------------------------+
  |                           |
Immediate                  Scheduled
  |                           |
  v                           v
pending                    scheduled
  |                           |
  v                           v
Delivery                Wait Until Due
  |                           |
  |                    Process Scheduled
  |                           |
  +-------------+-------------+
                |
                v
          Delivery Service
                |
          +-----+------+
          |            |
          v            v
        Email        System
          |            |
          v            |
         SMTP           |
          |             |
       +--+--+          |
       |     |          |
       v     v          v
      sent failed      sent
             |
             v
           retry
             |
             v
          delivery
```

---

# 111. Summary

Notification Service demonstrates how notification records and delivery logic can be managed as separate responsibilities.

The central architecture can be summarized as:

```text
Request
   |
   v
Validation
   |
   v
Persistence
   |
   v
Delivery
   |
   +--> Email / SMTP
   |
   +--> System
   |
   v
Status Tracking
   |
   +--> Sent
   |
   +--> Failed
   |
   +--> Retry

Scheduled Notifications
   |
   v
Due-Time Processing

Notification History
   |
   +--> Search
   +--> Filter
   +--> Sort
   +--> Paginate
   +--> Read / Unread
   +--> Delete
```

This provides a practical foundation for understanding notification backends before introducing more advanced queue, worker, push, SMS, and distributed delivery infrastructure.

---

# 112. Author

**Ashish Ranjan**

---

# 113. Links

- Portfolio: https://www.ashishranjan.net
- GitHub: https://github.com/a2rp
- CodePen: https://codepen.io/ash1198
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- YouTube: https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1
- Email: mailto:ash.ranjan09@gmail.com

---

# 114. Support

- Support: https://a2rp-donation-page.netlify.app/
- Buy Me A Coffee: https://buymeacoffee.com/a2rp
- Patreon: https://patreon.com/a2rp

---

# 115. License

This project is licensed under the MIT License.
