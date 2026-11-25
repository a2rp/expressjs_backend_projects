# Authentication System

An Express API starter for MongoDB-backed authentication flows: registration, email verification, access and refresh JWTs in HttpOnly cookies, logout, and password reset.

Email delivery is not configured. In development, verification and password-reset tokens are returned by the API for local use; production responses omit them. Connect an email provider before deploying these flows.

## Features

- User registration
- Password hashing with bcryptjs
- Email verification flow
- Resend verification flow
- Login with email and password
- JWT access tokens
- JWT refresh tokens
- HttpOnly authentication cookies
- Protected profile route
- Refresh access token flow
- Logout and session invalidation
- Forgot password flow
- Password reset flow
- Refresh token hashing
- Verification token hashing
- Password reset token hashing
- MongoDB integration
- Mongoose schema validation
- Request validation
- Centralized error handling
- Graceful shutdown
- Environment configuration
- Health check endpoint
- API testing with `requests.http`

## Tech Stack

- Node.js
- ExpressJS
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token
- cookie-parser
- Nodemon

## API Endpoints

### Root

```http
GET /
```

### Health Check

```http
GET /api/v1/health
```

### Register

```http
POST /api/v1/auth/register
```

### Verify Email

```http
POST /api/v1/auth/verify-email
```

### Resend Verification

```http
POST /api/v1/auth/resend-verification
```

### Login

```http
POST /api/v1/auth/login
```

### Refresh Access Token

```http
POST /api/v1/auth/refresh
```

### Logout

```http
POST /api/v1/auth/logout
```

### Authenticated Profile

```http
GET /api/v1/auth/profile
```

### Forgot Password

```http
POST /api/v1/auth/forgot-password
```

### Reset Password

```http
POST /api/v1/auth/reset-password
```

## Environment

Create a `.env` file using `.env.example`:

```env
PORT=1198
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/authentication_system

JWT_ACCESS_SECRET=replace_with_a_strong_access_secret
JWT_REFRESH_SECRET=replace_with_a_strong_refresh_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

ACCESS_COOKIE_MAX_AGE=900000
REFRESH_COOKIE_MAX_AGE=604800000
```

The `.env` file is ignored by Git. `.env.example` documents the required environment variables.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Default Port

```text
1198
```

## Authentication Flow

```text
Register
   |
   v
Verify Email
   |
   v
Login
   |
   v
Access Token + Refresh Token Cookies
   |
   v
Protected Routes
   |
   v
Refresh Access Token
   |
   v
Logout
```

## Password Reset Flow

```text
Forgot Password
      |
      v
Generate Reset Token
      |
      v
Validate Reset Token
      |
      v
Set New Password
      |
      v
Invalidate Existing Access and Refresh Sessions
```

## Project Structure

```text
authentication-system/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- validators/
|   |-- app.js
|   `-- server.js
|-- .env.example
|-- .gitignore
|-- package-lock.json
|-- package.json
|-- requests.http
`-- README.md
```

## Security Notes

- Passwords are hashed before storage.
- Raw refresh tokens are not stored in MongoDB.
- Verification and password-reset tokens are stored as hashes.
- Access and refresh tokens use separate secrets.
- Authentication cookies are HttpOnly.
- Protected routes validate access tokens before controller execution.
- A new login, logout, or password reset increments the account auth version and rejects access tokens from older sessions.
- Password reset also invalidates the stored refresh session.
- Verification and password-reset tokens are returned only in development; forgot-password and resend-verification responses stay generic to limit account enumeration.
- Configure an email provider before production so users can receive verification and password-reset links.

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
