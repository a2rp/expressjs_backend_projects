# Node.js Firestore CRUD API

A small Express API demonstrating create, read, update, and delete operations with Cloud Firestore and the Firebase Admin SDK.

## Requirements

- Node.js 22 or newer
- A Firebase project with Cloud Firestore enabled
- Google Application Default Credentials for that project

## Configure credentials

For local development, create a new Firebase service-account key, store it outside this repository, and set `GOOGLE_APPLICATION_CREDENTIALS` to the file's full path. Never commit service-account JSON files. Google Cloud environments can use their attached service identity.

Example PowerShell configuration:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\secure\firebase-service-account.json"
$env:GOOGLE_CLOUD_PROJECT = "your-firebase-project-id"
```

Copy `.env.example` to `.env` to set local port and credential values.

> **Security:** This demo has no authentication. The Firebase Admin SDK has privileged access and bypasses Firestore Security Rules. Keep the server bound to localhost and use test data; add authentication and authorization before exposing it to other users.

## Run locally

```bash
npm install
npm run dev
```

The server listens on `127.0.0.1:1198` by default. Set `HOST` or `PORT` to override these values. `npm start` runs without the development watcher.

## API routes

All request bodies use JSON and are limited to 16 KB.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/v1/a2rp` | API status message |
| `POST` | `/api/v1/create` | Create a user with `firstName`, `lastName`, and `email` |
| `GET` | `/api/v1/users` | Read up to 100 users |
| `GET` | `/api/v1/users/:id` | Read one user |
| `PATCH` | `/api/v1/users/:id` | Update one or more supported user fields |
| `DELETE` | `/api/v1/users/:id` | Delete a user |

Example create request:

```http
POST http://127.0.0.1:1198/api/v1/create
Content-Type: application/json

{
  "firstName": "Asha",
  "lastName": "Kumar",
  "email": "asha@example.com"
}
```

The API validates fields, returns JSON errors, and limits reads to protect against accidentally fetching the full collection.
