# backend-refresh-token-auth-api

Secure authentication API using short-lived access tokens, rotating refresh tokens, MongoDB, and HttpOnly cookies.

## Features

- User registration, login, current-user, refresh, and logout endpoints
- 15-minute access tokens
- Seven-day refresh tokens with bcrypt-hashed storage
- Refresh token rotation and reuse invalidation
- Secure configurable HttpOnly cookies
- Password hashing and input validation
- Helmet security headers and authentication rate limiting
- Configurable CORS with credentials
- Safe errors, request limits, standardized API responses, and request logs

## Requirements

- Node.js 20.19 or newer
- MongoDB running locally or a hosted MongoDB connection

## Setup

```bash
npm install
copy .env.example .env
```

Replace both JWT secret placeholders with different unique random values of at least 32 characters. In production, set `NODE_ENV=production` and provide trusted frontend origins in `CLIENT_ORIGINS`. If the frontend and API are hosted on different sites, set `COOKIE_SAME_SITE=none`; serve the API over HTTPS so the cookies use `Secure`.

## Run

```bash
npm run dev
```

The default port is `1198`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Server port, defaults to `1198` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Yes | Unique access token secret, minimum 32 characters |
| `JWT_REFRESH_SECRET` | Yes | Different unique refresh token secret, minimum 32 characters |
| `NODE_ENV` | No | Use `production` to enable Secure cookies |
| `CLIENT_ORIGINS` | Production | Comma-separated trusted frontend origins |
| `COOKIE_SAME_SITE` | No | Defaults to `lax`. Use `none` for cross-site frontend/API deployments; it requires production Secure cookies |

## API endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/` | Public | API status |
| GET | `/health` | Public | Health response |
| POST | `/api/auth/register` | Public | Register and authenticate |
| POST | `/api/auth/login` | Public | Login and rotate tokens |
| POST | `/api/auth/refresh-token` | Refresh cookie | Rotate access and refresh tokens |
| GET | `/api/auth/me` | Access cookie | Get current user |
| POST | `/api/auth/logout` | Public | Revoke refresh token and clear cookies |

All JSON responses include `apiUrl` as the first field. Browser clients must use `credentials: "include"` for cookie-based requests.

Passwords must contain at least 8 characters and no more than 72 UTF-8 bytes. Refresh tokens are stored as bcrypt hashes; rotating a token replaces the previous token, and reuse of an old signed refresh token invalidates the stored session. Each user has one active refresh-token session, so logging in again replaces the previous one. Authentication rate limits are held in memory per process; multi-instance deployments need a shared limiter store. Logout clears the browser cookies and revokes the active refresh token.


## License

MIT. See [LICENSE](./LICENSE).

## Author

**Ashish Ranjan**

Full-Stack Web Developer

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [https://www.patreon.com/a2rp](https://www.patreon.com/a2rp)
