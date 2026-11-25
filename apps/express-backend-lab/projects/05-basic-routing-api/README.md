# 05 - Basic Routing API

API that demonstrates multiple routes using GET and POST methods.

---

## Description

This project demonstrates basic routing in Express using multiple HTTP methods.

It includes:

- a `GET` route to fetch user data
- a `POST` route to create a new user

This is an important Express concept because real APIs usually have different routes for different actions.

---

## Run the Project

From root folder:

```bash
npm run dev:05
```

Or directly:

```bash
node projects/05-basic-routing-api/index.js
```

---

## API Endpoints

### GET /users

Fetch the current in-memory user list. Users added with `POST /users` appear here until the server restarts.

```text
http://localhost:1198/users
```

### POST /users

Create a new user.

```text
http://localhost:1198/users
```

Request body:

```json
{
    "name": "Ashish"
}
```

The name must be a non-empty string. Missing, non-string, or whitespace-only names return `400 Bad Request`.

---

## Example Responses

### GET /users

```json
{
    "success": true,
    "project": "05 - Basic Routing API",
    "message": "Users fetched successfully",
    "data": [
        {
            "id": 1,
            "name": "User 1"
        },
        {
            "id": 2,
            "name": "User 2"
        }
    ]
}
```

### POST /users

```json
{
    "success": true,
    "project": "05 - Basic Routing API",
    "message": "User created successfully",
    "user": {
        "id": 3,
        "name": "Ashish"
    }
}
```

The new user is appended to the in-memory list and appears in the next `GET /users` response. Restarting the server restores the two sample users.

### POST rejects an empty name

```http
POST http://localhost:1198/users
Content-Type: application/json

{}
```

Expected response: `400 Bad Request` with `"A non-empty name is required."`.

---

## API Testing

Use `api-test.rest` file in VS Code:

```http
### GET all users
GET http://localhost:1198/users

### POST create user
POST http://localhost:1198/users
Content-Type: application/json

{
  "name": "Ashish"
}

### GET users again to see the new record
GET http://localhost:1198/users

### POST rejects a missing name
POST http://localhost:1198/users
Content-Type: application/json

{}
```

---

## Folder Structure

```text
05-basic-routing-api
├── index.js
├── api-test.rest
└── README.md
```

---

## What You Learn

- How to create multiple routes in Express
- Difference between `GET` and `POST`
- How to read request body using `req.body`
- Why `express.json()` middleware is needed
- How APIs handle fetching and creating data

---

## Notes

- `GET` is generally used to fetch data
- `POST` is generally used to create new data
- `express.json()` is required to read JSON body from requests
- This project uses fake in-memory data, not a database

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
- Buy Me A Coffee: [https://buymeacoffee.com/a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [https://patreon.com/a2rp](https://patreon.com/a2rp)
