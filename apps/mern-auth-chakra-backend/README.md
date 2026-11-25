# MERN Auth Chakra Backend

Express and MongoDB API for the companion [Chakra UI frontend](https://github.com/a2rp/mern-auth-chakra-frontend). It provides registration, login, HttpOnly JWT cookies, role-based admin routes, and self-service profile endpoints.

## Features

- Password hashing with bcryptjs
- Input validation with Zod
- HttpOnly JWT cookies with configurable expiry
- User and admin routes protected by database-checked roles
- Rate-limited authentication endpoints and Helmet security headers
- Profile updates and password changes

## Requirements

- Node.js 18 or newer
- MongoDB 6 or newer

## Run locally

Copy `.env.example` to `.env`. Set a private random `JWT_SECRET` of at least 32 bytes and configure `MONGODB_URI`. Then run:

```bash
npm ci
npm run dev
```

The API listens on port `1198` by default. The companion frontend uses `http://localhost:5173`; set `FRONTEND_URL` to the allowed frontend origin, or a comma-separated list of origins. `COOKIE_DOMAIN` is optional and should normally be left unset for local development. In production, use HTTPS so the cookie Secure flag is enabled. The default `COOKIE_SAME_SITE=lax` supports same-site hosting; for a separate-site frontend such as GitHub Pages, set `NODE_ENV=production` and `COOKIE_SAME_SITE=none`.

`JWT_EXPIRES` defaults to `2h` and accepts a duration such as `30m`, `8h`, or `7d`. New registrations receive the `user` role. To bootstrap the first administrator, promote a trusted account directly in MongoDB, for example:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

## API routes

- `POST /api/auth/register` — create an account and start a session
- `POST /api/auth/login` — start a session
- `GET /api/auth/me` — return the current user
- `POST /api/auth/logout` — clear the session cookie
- `GET /api/users/me` — read the current profile
- `PUT /api/users/me` — update name or email
- `PUT /api/users/me/password` — change the password
- `/api/admin/users` — admin-only user list and management routes
- `GET /api/health` — service health check

## Links

- [Portfolio](https://www.ashishranjan.net)
- [GitHub](https://github.com/a2rp)
- [Companion frontend](https://github.com/a2rp/mern-auth-chakra-frontend)
- [LinkedIn](https://www.linkedin.com/in/aashishranjan)
- [CodePen](https://codepen.io/ash1198)
