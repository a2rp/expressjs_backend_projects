# MongoDB CRUD API

A local REST API for creating, reading, updating, and deleting MongoDB user records with Express and Mongoose.

## Requirements

- Node.js 22 or newer
- npm
- A local MongoDB server

## Run locally

```powershell
Copy-Item .env.example .env
npm ci
npm run dev
```

The API listens on `http://127.0.0.1:1198`. Set `MONGODB_LOCAL_URL` in `.env` to point at a local MongoDB database. Set `PORT` or `HOST` to change the listener.

## Routes

All endpoints are under `/api/v1/user` and accept/return JSON.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/user?limit=50&skip=0` | List users with pagination metadata |
| `POST` | `/api/v1/user` | Create a user with `name`, `email`, and `phone` |
| `GET` | `/api/v1/user/:id` | Read one user |
| `PATCH` | `/api/v1/user/:id` | Update one or more user fields |
| `DELETE` | `/api/v1/user/:id` | Delete one user (returns `204`) |

List requests default to 50 records and accept a `limit` from 1 to 100 with a non-negative `skip`. Email addresses are normalized to lowercase and must be unique. Names, email addresses, and phone numbers are validated before storage.

Example create body:

```json
{
  "name": "Ashish Ranjan",
  "email": "ashish@example.com",
  "phone": "+1 555 010 0200"
}
```

## Scope

This is a learning project. It has no authentication or authorization and stores personal contact details, so keep it bound to localhost and use only disposable sample data. Do not expose it to the internet or use it for real users without adding access controls and a security review.
