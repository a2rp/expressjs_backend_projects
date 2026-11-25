# express-project-08-multiple-route-modules-api

A small Express.js API that demonstrates separating routers, controllers, and shared utilities for user and product endpoints. The sample records are stored in memory and are not connected to a database.

## Project structure

```text
express-project-08-multiple-route-modules-api/
├── src/
│   ├── controllers/
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   ├── routes/
│   │   ├── product.route.js
│   │   └── user.route.js
│   └── utils/
│       └── parsePositiveId.js
├── .gitignore
├── api-test.rest
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

## Requirements and setup

Use Node.js 18 or later. Install dependencies:

```bash
npm install
```

Run in development mode with automatic restarts:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The API listens at `http://localhost:1198`. Example requests are in [`api-test.rest`](./api-test.rest) for the VS Code REST Client.

## Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/` | API status message |
| `GET` | `/users` | List the sample users |
| `GET` | `/users/:id` | Fetch a user by ID |
| `GET` | `/products` | List the sample products |
| `GET` | `/products/:id` | Fetch a product by ID |

Detail routes accept positive integer IDs. A malformed ID returns `400 Bad Request`; a valid ID that is not in the sample data returns `404 Not Found`.

### Example user response

`GET /users/1`

```json
{
  "message": "Single user fetched successfully",
  "data": {
    "id": 1,
    "name": "User 1"
  }
}
```

### Example product response

`GET /products/2`

```json
{
  "message": "Single product fetched successfully",
  "data": {
    "id": 2,
    "name": "Product 2",
    "price": 999
  }
}
```

## Learning focus

The entry point mounts each router at its resource path, while each router delegates to its own controller. A shared utility parses and validates resource IDs. This keeps the routing example focused without a database dependency.

## Author and links

- GitHub: https://github.com/a2rp
- Portfolio: https://www.ashishranjan.net
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- CodePen: https://codepen.io/ash1198
- YouTube: https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1
- Email: ash.ranjan09@gmail.com
- Support: https://a2rp-donation-page.netlify.app/
- Buy Me a Coffee: https://buymeacoffee.com/ashishranjan
- Patreon: https://patreon.com/ashishranjan