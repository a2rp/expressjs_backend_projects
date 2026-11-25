# Database Engineering API

A practical backend API built with Node.js, Express, MongoDB, and Mongoose to demonstrate important database engineering concepts through a complete product API.

## Features

- MongoDB database integration
- Mongoose schema and model
- CRUD operations
- Schema validation
- Database indexes
- Text search
- Category filtering
- Price range filtering
- Stock filtering
- Pagination
- Sorting
- Soft delete
- Restore deleted records
- Seed data
- API versioning
- Centralized error handling
- Graceful server shutdown
- Environment configuration
- Health check endpoint
- API testing with `requests.http`

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Nodemon

## API Endpoints

### Root

```http
GET /
```

### Health Check

```http
GET /api/v1/health
```

### Get Products

```http
GET /api/v1/products
```

### Get Product By ID

```http
GET /api/v1/products/:id
```

This endpoint returns active products only. Soft-deleted products are omitted, matching the default product list behavior.

### Create Product

```http
POST /api/v1/products
```

### Update Product

```http
PUT /api/v1/products/:id
```

### Soft Delete Product

```http
DELETE /api/v1/products/:id
```

### Restore Product

```http
PATCH /api/v1/products/:id/restore
```

## Query Examples

### Search

```http
GET /api/v1/products?search=keyboard
```

### Pagination

```http
GET /api/v1/products?page=1&limit=5
```

### Category Filter

```http
GET /api/v1/products?category=Accessories
```

### Price Range

```http
GET /api/v1/products?minPrice=2000&maxPrice=7000
```

### Stock Filter

```http
GET /api/v1/products?inStock=true
```

### Sorting

```http
GET /api/v1/products?sort=price&order=asc
```

### Include Soft Deleted Records

```http
GET /api/v1/products?includeDeleted=true
```

## Environment

Create a `.env` file using `.env.example`:

```env
PORT=1198
MONGO_URI=mongodb://127.0.0.1:27017/database_engineering_api
```

The `.env` file is ignored by Git, while `.env.example` documents the required environment variables.

Every JSON response starts with `apiUrl`, and each request is logged with its method, path, and status code.

The health endpoint returns HTTP 503 when MongoDB is disconnected. Unexpected server errors return a generic message; details are written to the server log.

## Installation

```bash
npm install
```

## Seed Database

```bash
npm run seed
```

This clears the existing product collection and inserts the included demonstration products.

## Development

```bash
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
database-engineering-api/
|-- scripts/
|   `-- seed.js
|-- src/
|   |-- config/database.js
|   |-- controllers/product.controllers.js
|   |-- middlewares/
|   |   |-- errorHandler.middleware.js
|   |   `-- notFound.middleware.js
|   |-- models/product.model.js
|   |-- routes/product.routes.js
|   |-- validators/product.validators.js
|   |-- app.js
|   `-- server.js
|-- .env.example
|-- .gitignore
|-- package.json
|-- requests.http
`-- README.md
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
