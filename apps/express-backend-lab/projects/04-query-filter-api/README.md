# 04 - Query Params API

API that uses query parameters to filter user data.

---

## Description

This project demonstrates how to use query parameters in Express.

The route `/users?age=25` reads values from the URL query string and returns them in the response.

Query parameters are commonly used for filtering, searching, sorting, and pagination in real APIs.

---

## Run the Project

From root folder:

```bash
npm run dev:04
```

Or directly:

```bash
node projects/04-query-filter-api/index.js
```

---

## API Endpoint

### GET /users

Examples:

```text
http://localhost:1198/users?age=25
http://localhost:1198/users?age=30&name=ashish
http://localhost:1198/users?name=rahul
http://localhost:1198/users
```

---

## Example Response

```json
{
    "success": true,
    "project": "04 - Query Params API",
    "message": "User data fetched using query parameters",
    "filters": {
        "age": "25",
        "name": "ashish"
    }
}
```

---

## API Testing

Use `api-test.rest` file in VS Code:

```http
### Query Params - Only age
GET http://localhost:1198/users?age=25

### Query Params - Age and Name
GET http://localhost:1198/users?age=30&name=ashish

### Query Params - Only name
GET http://localhost:1198/users?name=rahul

### Query Params - No filters
GET http://localhost:1198/users
```

---

## Folder Structure

```text
04-query-filter-api
├── index.js
├── api-test.rest
└── README.md
```

---

## What You Learn

- How to read query parameters using `req.query`
- How filtering works in APIs
- Difference between route params and query params
- How optional values behave in requests

---

## Notes

- Query parameters come after `?` in the URL
- Multiple query parameters are joined using `&`
- Express makes query values available in `req.query`
- This concept is heavily used in filtering and search APIs

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