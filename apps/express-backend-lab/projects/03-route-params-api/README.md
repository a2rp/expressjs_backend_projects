# 03 - Route Params API

API that uses route parameters to return user data.

---

## Description

This project demonstrates how to use dynamic route parameters in Express.

The route `/users/:id` reads the `id` value from the URL and returns user data based on that value.

This is one of the most important Express concepts because many real APIs use route params for resources like users, products, orders, and posts.

---

## Run the Project

From root folder:

```bash
npm run dev:03
```

Or directly:

```bash
node projects/03-route-params-api/index.js
```

---

## API Endpoint

### GET /users/:id

Example:

```text
http://localhost:1198/users/1
http://localhost:1198/users/25
http://localhost:1198/users/999
```

---

## Example Response

```json
{
    "success": true,
    "project": "03 - Route Params API",
    "message": "User data fetched successfully using route parameter",
    "user": {
        "id": "25",
        "name": "User 25"
    }
}
```

---

## API Testing

Use `api-test.rest` file in VS Code:

```http
### Route Params API - User 1
GET http://localhost:1198/users/1

### Route Params API - User 25
GET http://localhost:1198/users/25

### Route Params API - User 999
GET http://localhost:1198/users/999
```

---

## Folder Structure

```text
03-route-params-api
├── index.js
├── api-test.rest
└── README.md
```

---

## What You Learn

- How to create dynamic routes in Express
- How to read values from `req.params`
- How to use URL parameters like `:id`
- How APIs return data based on route input

---

## Notes

- Route parameters are dynamic parts of the URL
- In `/users/:id`, the `:id` part changes based on the request
- Express makes route params available in `req.params`
- This concept is used heavily in real APIs

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