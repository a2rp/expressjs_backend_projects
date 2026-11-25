# Node.js Auth & Customers API

An Express and MongoDB API that demonstrates account registration, password hashing, expiring JWT cookies, and user-owned customer records.

## Requirements

- Node.js 22 or newer
- MongoDB, local or hosted

## Run locally

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` and replace `JWT_SECRET` with a randomly generated value of at least 32 characters.
3. Install and start the server:

```bash
npm install
npm run start:dev
```

The API listens on port `5000` by default. `npm start` runs without the file watcher.

For a local secret, generate one with:

```bash
node -p "require('crypto').randomBytes(48).toString('hex')"
```

## API routes

All request bodies use JSON. The JSON parser accepts bodies up to 16 KB. Authentication uses an HTTP-only `token` cookie; browser clients must send requests with credentials enabled.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running |
| `POST` | `/api/user/register` | Register with `email`, `password`, and `passwordVerify` |
| `POST` | `/api/user/login` | Sign in with `email` and `password` |
| `POST` | `/api/user/logout` | Clear the authentication cookie |
| `GET` | `/api/user/isLoggedIn` | Return the authenticated user ID |
| `POST` | `/api/customer/add` | Add a customer using `{ "name": "..." }` |
| `GET` | `/api/customer/all` | Return up to 100 customers owned by the signed-in user |

Login and registration are limited to 10 requests per IP every 15 minutes using an in-memory rate-limit store. Use a shared store when running multiple server instances.

## Configuration

- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: random secret of at least 32 characters.
- `CORS_ORIGINS`: comma-separated exact browser origins allowed to send credentialed requests.
- `COOKIE_SAME_SITE`: defaults to `lax` locally; cross-site deployments need `none` and HTTPS.
- `PORT`: HTTP port, defaults to `5000`.

The user email field has a unique MongoDB index. If a database already contains duplicate email addresses, remove duplicates before building that index.

## Security notes

Passwords are hashed with bcrypt and are never returned by the API. Passwords must be at least 8 characters and no more than 72 UTF-8 bytes, matching bcrypt's input limit. JWTs expire after seven days. The customer routes require authentication and only return records belonging to the signed-in user.

This is a learning API, not a complete production identity service. Use HTTPS, a shared rate-limit store, monitoring, and a reviewed deployment configuration before exposing it publicly. CORS is a browser policy and does not replace authentication or authorization.
