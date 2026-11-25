# Production REST API - Documentation

## 1. Overview

Production REST API is a backend project built with Node.js and ExpressJS to demonstrate how a clean REST API can be structured for practical backend development.

The project focuses on:

- RESTful CRUD operations
- API versioning
- Request validation
- Pagination
- Searching
- Filtering
- Sorting
- Structured responses
- Centralized error handling
- Graceful shutdown
- Local API testing

The project intentionally uses in-memory data so the focus stays on REST API design and backend structure rather than database implementation.

---

# 2. Technology Stack

## Node.js

Node.js runs the backend JavaScript application.

It handles:

- Application execution
- HTTP server runtime
- Request processing
- Business logic
- Process events

## ExpressJS

ExpressJS provides the HTTP API layer.

It is used for:

- Routing
- Middleware
- Request parsing
- Controllers
- HTTP responses
- Error handling

## Nodemon

Nodemon automatically restarts the development server whenever project files change.

---

# 3. Application Architecture

The project separates responsibilities into clear layers.

```text
Client Request
      |
      v
ExpressJS
      |
      v
Route
      |
      v
Validator
      |
      v
Controller
      |
      v
Data Layer
      |
      v
JSON Response
```

This makes each part of the application easier to understand and maintain.

---

# 4. Project Structure

```text
production-rest-api/
├── src/
│   ├── controllers/
│   │   └── product.controllers.js
│   ├── data/
│   │   └── product.data.js
│   ├── middlewares/
│   │   ├── errorHandler.middleware.js
│   │   └── notFound.middleware.js
│   ├── routes/
│   │   └── product.routes.js
│   ├── validators/
│   │   └── product.validators.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── DOCUMENTATION.md
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
└── requests.http
```

---

# 5. `src/server.js`

`server.js` is the application entry point.

Its responsibilities are:

- Loading environment variables
- Reading the configured port
- Starting the ExpressJS server
- Displaying useful API URLs
- Handling shutdown signals
- Handling unexpected process failures

The default port is:

```text
1198
```

The server prints important URLs such as:

```text
Root:     http://localhost:1198/
Health:   http://localhost:1198/api/v1/health
Products: http://localhost:1198/api/v1/products
```

---

# 6. Graceful Shutdown

The server listens for operating-system signals such as:

```text
SIGINT
SIGTERM
```

For example, pressing:

```text
Ctrl + C
```

normally triggers `SIGINT`.

Instead of terminating immediately, the application closes the HTTP server cleanly.

Flow:

```text
Shutdown Signal
      |
      v
Stop Accepting Requests
      |
      v
Close HTTP Server
      |
      v
Exit Process
```

This is called graceful shutdown.

---

# 7. `src/app.js`

`app.js` configures the ExpressJS application.

It contains:

- JSON parsing
- Root endpoint
- Health endpoint
- Product routes
- 404 middleware
- Centralized error middleware

The file is separate from `server.js` so ExpressJS configuration and server startup remain independent.

---

# 8. JSON Request Parsing

The application uses:

```js
app.use(express.json());
```

This allows the API to receive JSON request bodies.

Example:

```json
{
    "name": "Wireless Keyboard",
    "description": "Compact wireless keyboard.",
    "category": "Accessories",
    "price": 2499,
    "inStock": true
}
```

---

# 9. Removing the Express Header

The project disables:

```text
X-Powered-By
```

using:

```js
app.disable("x-powered-by");
```

This keeps the response headers cleaner and avoids unnecessarily advertising the framework.

---

# 10. API Versioning

Product routes are grouped under:

```text
/api/v1
```

For example:

```http
GET /api/v1/products
```

instead of:

```http
GET /products
```

Versioning allows future API versions such as:

```text
/api/v2
```

without silently changing the behavior of existing clients.

---

# 11. Root Endpoint

Endpoint:

```http
GET /
```

Purpose:

Confirm that the application is available.

Example response:

```json
{
    "success": true,
    "message": "Production REST API is running.",
    "version": "v1"
}
```

---

# 12. Health Check

Endpoint:

```http
GET /api/v1/health
```

The health endpoint returns basic runtime information such as:

- Service name
- API version
- Process uptime
- Current timestamp

This provides a simple operational check.

---

# 13. Product Routes

File:

```text
src/routes/product.routes.js
```

The route layer maps HTTP requests to controllers.

Main routes:

```http
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
```

Routes also attach validators before controllers.

Example flow:

```text
Request
   |
   v
Route
   |
   v
Validator
   |
   v
Controller
```

---

# 14. Product Data

File:

```text
src/data/product.data.js
```

The project uses an in-memory array of product objects.

Example:

```json
{
    "id": 1,
    "name": "Wireless Keyboard",
    "description": "Compact wireless keyboard for everyday productivity.",
    "category": "Accessories",
    "price": 2499,
    "inStock": true
}
```

This keeps the project focused on REST API behavior instead of database setup.

The database-specific concepts are intentionally handled in a separate backend project.

---

# 15. Controllers

File:

```text
src/controllers/product.controllers.js
```

Controllers contain the main request-processing logic.

The project includes:

```text
getProducts
getProductById
createProduct
updateProduct
deleteProduct
```

Each controller receives:

```text
req
res
```

and produces an HTTP response.

---

# 16. Get All Products

Endpoint:

```http
GET /api/v1/products
```

The controller starts with a copy of the product collection and then applies optional query operations.

Possible operations include:

- Searching
- Filtering
- Sorting
- Pagination

---

# 17. Search

Example:

```http
GET /api/v1/products?search=keyboard
```

The search term is compared against:

- Product name
- Product description

The comparison is case-insensitive.

Flow:

```text
Search Query
     |
     v
Convert to Lowercase
     |
     v
Check Product Name
     |
     v
Check Description
     |
     v
Return Matches
```

---

# 18. Category Filtering

Example:

```http
GET /api/v1/products?category=Audio
```

Products are filtered by category.

Category matching is case-insensitive.

---

# 19. Price Filtering

Example:

```http
GET /api/v1/products?minPrice=2000&maxPrice=7000
```

Two optional filters are supported:

```text
minPrice
maxPrice
```

A product is returned only when its price falls inside the requested range.

---

# 20. Stock Filtering

Example:

```http
GET /api/v1/products?inStock=true
```

The query-string value arrives as text.

The controller converts it to a Boolean before filtering products.

---

# 21. Sorting

Example:

```http
GET /api/v1/products?sort=price&order=asc
```

The API allows sorting using selected fields.

Supported direction values:

```text
asc
desc
```

`asc` means ascending.

`desc` means descending.

Sorting can work with both numeric and string values.

---

# 22. Pagination

Example:

```http
GET /api/v1/products?page=1&limit=5
```

Pagination uses:

```text
page
limit
```

The start position is calculated using:

```text
(page - 1) × limit
```

Example:

```text
page = 3
limit = 5

start = 10
```

The API then returns the requested section of the product collection.

---

# 23. Pagination Metadata

Responses include pagination information such as:

```json
{
    "page": 1,
    "limit": 5,
    "totalItems": 12,
    "totalPages": 3
}
```

This gives API consumers enough information to build paginated interfaces.

---

# 24. Combined Queries

Multiple query options can be combined.

Example:

```http
GET /api/v1/products?search=keyboard&category=Accessories&inStock=true&sort=price&order=asc&page=1&limit=10
```

The controller processes these operations step by step.

This demonstrates how flexible REST query endpoints can be constructed without creating separate routes for every combination.

---

# 25. Get Product By ID

Endpoint:

```http
GET /api/v1/products/:id
```

The validator first confirms that the ID is a positive integer.

The controller then searches for a matching product.

If found:

```text
200 OK
```

If not found:

```text
404 Not Found
```

---

# 26. Create Product

Endpoint:

```http
POST /api/v1/products
```

The request body is validated first.

The controller then calculates a new product ID and adds the product to the in-memory collection.

Successful creation returns:

```text
201 Created
```

---

# 27. Update Product

Endpoint:

```http
PUT /api/v1/products/:id
```

The project uses full product validation for updates.

The product is located by ID and its editable fields are replaced.

The original:

```text
createdAt
```

value is preserved.

The:

```text
updatedAt
```

value is refreshed.

---

# 28. Delete Product

Endpoint:

```http
DELETE /api/v1/products/:id
```

The product is located by ID and removed from the in-memory array.

The deleted product is returned in the response for clarity.

---

# 29. Request Validation

File:

```text
src/validators/product.validators.js
```

Validation is performed before controllers execute.

The project validates:

- Product ID
- Name
- Description
- Category
- Price
- Stock value
- Minimum price
- Maximum price
- Sort field
- Sort order
- Page number
- Page limit

---

# 30. Why Validate Before Controllers?

Without validation, controllers would need to repeatedly check malformed input.

Using middleware gives a cleaner flow:

```text
Request
   |
   v
Validator
   |
Invalid
   |
   +------> 400 Response

Valid
   |
   v
Controller
```

This keeps controller logic focused on the requested operation.

---

# 31. Allowed Sort Fields

Clients cannot provide arbitrary values as sorting fields.

The validator uses an allow-list.

Example:

```text
id
name
category
price
inStock
createdAt
updatedAt
```

This keeps the query interface predictable.

---

# 32. Page Limit Protection

The API limits the maximum number of products requested per page.

Example rule:

```text
1 <= limit <= 100
```

This prevents accidental requests for unreasonable page sizes.

---

# 33. Standard Response Structure

Successful responses generally follow:

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

Errors generally follow:

```json
{
    "success": false,
    "message": "Something went wrong."
}
```

Using a predictable response structure makes APIs easier to consume.

---

# 34. HTTP Status Codes

The project demonstrates important HTTP status codes.

```text
200 OK
Successful read, update, or delete

201 Created
New resource successfully created

400 Bad Request
Invalid request data

404 Not Found
Resource or route does not exist

500 Internal Server Error
Unexpected server failure
```

---

# 35. 404 Middleware

File:

```text
src/middlewares/notFound.middleware.js
```

When no valid route matches the request, this middleware returns a structured `404` response.

Example:

```json
{
    "success": false,
    "message": "Route not found.",
    "method": "GET",
    "path": "/api/v1/not-found"
}
```

This creates consistent behavior for unknown routes.

---

# 36. Centralized Error Handling

File:

```text
src/middlewares/errorHandler.middleware.js
```

Unexpected errors are handled in one place.

Instead of returning different error structures from different parts of the application, the middleware creates a consistent response.

The error handler can use a custom status code when one exists.

Otherwise:

```text
500 Internal Server Error
```

is used.

---

# 37. Middleware Order

Middleware order matters in ExpressJS.

The project follows this general order:

```text
JSON Middleware
      |
      v
Application Routes
      |
      v
404 Middleware
      |
      v
Error Middleware
```

The 404 middleware must run after valid routes.

The error handler remains last.

---

# 38. Environment Configuration

File:

```text
.env.example
```

Example:

```env
PORT=1198
```

The application reads:

```text
PORT
```

from environment variables.

If no value exists, it falls back to:

```text
1198
```

---

# 39. `.env.example`

`.env.example` documents the environment variables needed by the project.

Unlike a real `.env` file, it is safe to commit because it should not contain private production secrets.

---

# 40. `.gitignore`

The `.gitignore` file prevents unnecessary local files from being committed.

Examples:

```text
node_modules
.env
logs
editor configuration
operating-system files
```

`node_modules` can always be recreated using:

```bash
npm install
```

so it should not be stored in the Git repository.

---

# 41. `requests.http`

The project includes:

```text
requests.http
```

This provides ready-to-run API tests.

It covers:

- Root
- Health
- Get all products
- Pagination
- Search
- Category filtering
- Price filtering
- Stock filtering
- Sorting
- Combined query
- Get product by ID
- Create
- Update
- Delete
- Invalid ID
- Missing product
- Invalid query
- Unknown route

---

# 42. Recommended Testing Sequence

A simple testing sequence is:

```text
Root
   |
Health
   |
Get All Products
   |
Get One Product
   |
Create Product
   |
Update Product
   |
Search / Filter / Sort
   |
Delete Product
   |
Error Cases
```

This tests both successful and unsuccessful API behavior.

---

# 43. Development

Install dependencies:

```bash
npm install
```

Run development mode:

```bash
npm run dev
```

Nodemon watches project files and restarts the server when required.

---

# 44. Production Command

Run:

```bash
npm start
```

This starts the application using Node.js directly.

---

# 45. Why This Project Uses In-Memory Data

The purpose of this repository is REST API engineering.

Using an in-memory dataset keeps the focus on:

- Endpoint design
- HTTP methods
- Status codes
- Request validation
- Query parameters
- Controllers
- Middleware
- API structure

Database engineering is handled separately so each repository teaches one focused backend area clearly.

---

# 46. REST Design Concepts Demonstrated

The project demonstrates:

```text
Resource-based URLs
HTTP methods
HTTP status codes
API versioning
Query parameters
Validation
Structured responses
Separation of concerns
Middleware
Error handling
```

---

# 47. Main Request Lifecycle

Example request:

```http
GET /api/v1/products?category=Audio&sort=price&order=asc&page=1&limit=5
```

Flow:

```text
HTTP Request
      |
      v
ExpressJS
      |
      v
Product Route
      |
      v
Query Validator
      |
      v
Product Controller
      |
      v
Filter Products
      |
      v
Sort Products
      |
      v
Paginate Products
      |
      v
JSON Response
```

---

# 48. Main Concepts Learned

After studying this project, the following concepts should be clear:

- Creating ExpressJS APIs
- Structuring routes
- Structuring controllers
- Building RESTful CRUD endpoints
- Using API versioning
- Handling query parameters
- Implementing search
- Implementing filters
- Implementing sorting
- Implementing pagination
- Validating request data
- Returning proper status codes
- Designing consistent responses
- Handling 404 routes
- Centralizing errors
- Using environment configuration
- Handling graceful shutdown
- Testing APIs with `requests.http`

---

# 49. Links

- Portfolio: https://www.ashishranjan.net
- GitHub: https://github.com/a2rp
- CodePen: https://codepen.io/ash1198
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- YouTube: https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1
- Email: mailto:ash.ranjan09@gmail.com

# 50. Support

- Support: https://a2rp-donation-page.netlify.app/
- Buy Me A Coffee: https://buymeacoffee.com/a2rp
- Patreon: https://patreon.com/a2rp

---

# 51. License

This project is licensed under the MIT License.
