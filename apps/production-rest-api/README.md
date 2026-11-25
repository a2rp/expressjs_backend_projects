# Production REST API

A production-style learning API built with Node.js and Express. It uses an in-memory product dataset that resets when the server restarts.

It demonstrates clean RESTful CRUD operations, request validation, pagination, filtering, sorting, searching, versioned routes, structured responses, health checks, and centralized error handling.

## Features

- RESTful CRUD operations
- API versioning with `/api/v1`
- Product routes and controllers
- Request validation
- Pagination
- Searching
- Category filtering
- Price range filtering
- Stock filtering
- Sorting
- Proper HTTP status codes
- Standard JSON responses
- Health check endpoint
- 404 handling
- Centralized error handling
- Graceful shutdown
- Local API testing with `requests.http`

## API Endpoints

### Root

```http
GET /
```

### Health Check

```http
GET /api/v1/health
```

### Get All Products

```http
GET /api/v1/products
```

### Get Product By ID

```http
GET /api/v1/products/:id
```

### Create Product

```http
POST /api/v1/products
```

### Update Product

```http
PUT /api/v1/products/:id
```

### Delete Product

```http
DELETE /api/v1/products/:id
```

## Query Examples

### Pagination

```http
GET /api/v1/products?page=1&limit=5
```

### Search

```http
GET /api/v1/products?search=keyboard
```

### Filter By Category

```http
GET /api/v1/products?category=Audio
```

### Filter By Price

```http
GET /api/v1/products?minPrice=2000&maxPrice=7000
```

### Filter By Stock

```http
GET /api/v1/products?inStock=true
```

### Sort

```http
GET /api/v1/products?sort=price&order=asc
```

## Run Locally

```bash
npm install
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

## Project Structure

```text
src/
├── controllers/
│   └── product.controllers.js
├── data/
│   └── product.data.js
├── middlewares/
│   ├── errorHandler.middleware.js
│   └── notFound.middleware.js
├── routes/
│   └── product.routes.js
├── validators/
│   └── product.validators.js
├── app.js
└── server.js
```

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
