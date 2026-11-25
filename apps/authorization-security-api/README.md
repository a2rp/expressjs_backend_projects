# Authorization Security API

A practical ExpressJS backend demonstrating authorization and API security using MongoDB, Mongoose, JWT authentication, role-based access control, permission-based access, API keys, Helmet, CORS, and rate limiting.

## Features

- JWT authentication
- Bearer token authorization
- Role-based access control
- User, Moderator, and Admin roles
- Permission-based access control
- Role or permission based access
- Admin-only user management
- User activation and deactivation
- API key protected routes
- Timing-safe API key comparison
- Helmet security headers
- CORS allow-list
- General API rate limiting
- Stricter authentication rate limiting
- MongoDB integration
- Mongoose schema validation
- Password hashing with bcryptjs
- Centralized error handling
- Graceful shutdown
- Health check endpoint
- API testing with `requests.http`

## Tech Stack

- Node.js
- ExpressJS
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- Helmet
- CORS
- express-rate-limit
- Nodemon

## Roles

The API supports:

```text
user
moderator
admin
```

## Permissions

Available permissions include:

```text
resource:read
resource:create
resource:update
resource:delete
user:manage
```

## API Endpoints

### Root

```http
GET /
```

### Health Check

```http
GET /api/v1/health
```

## Authentication

### Register

```http
POST /api/v1/auth/register
```

### Login

```http
POST /api/v1/auth/login
```

### Profile

```http
GET /api/v1/auth/profile
```

Requires:

```text
Authorization: Bearer ACCESS_TOKEN
```

## Protected Resources

### Authenticated User

```http
GET /api/v1/resources/user
```

### Moderator or Admin

```http
GET /api/v1/resources/moderator
```

### Admin Only

```http
GET /api/v1/resources/admin
```

### Read Permission

```http
GET /api/v1/resources/read
```

Requires:

```text
resource:read
```

### Resource Management

```http
GET /api/v1/resources/manage
```

Requires both:

```text
resource:update
resource:delete
```

### Flexible Access

```http
GET /api/v1/resources/flexible
```

Access is granted when the user has:

```text
admin role
```

or:

```text
resource:create permission
```

## Admin Endpoints

All admin routes require the `admin` role.

### Get Users

```http
GET /api/v1/admin/users
```

### Update User Role

```http
PATCH /api/v1/admin/users/:userId/role
```

### Update User Permissions

```http
PATCH /api/v1/admin/users/:userId/permissions
```

### Update User Status

```http
PATCH /api/v1/admin/users/:userId/status
```

## API Key Endpoints

API-key routes require:

```text
x-api-key: YOUR_API_KEY
```

### Protected API Key Resource

```http
GET /api/v1/api-key/resource
```

### Service Information

```http
GET /api/v1/api-key/service-info
```

## Environment

Create a `.env` file using `.env.example`.

```env
PORT=1198
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/authorization_security_api

JWT_ACCESS_SECRET=replace_with_a_strong_access_secret
JWT_ACCESS_EXPIRES_IN=15m

API_KEY=replace_with_a_strong_api_key

CORS_ORIGINS=http://localhost:5173
```

The `.env` file is ignored by Git.

## Installation

```bash
npm install
```

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

## Authorization Flow

```text
Login
   |
   v
Access Token
   |
   v
Authentication Middleware
   |
   v
Authenticated User
   |
   v
Role / Permission Check
   |
   v
Protected Resource
```

## Security Layers

```text
Helmet
   +
CORS
   +
Rate Limiting
   +
JWT Authentication
   +
RBAC
   +
Permissions
   +
API Key Protection
```

## Project Structure

```text
authorization-security-api/
|-- src/
|   |-- config/database.js
|   |-- controllers/
|   |-- middlewares/
|   |-- models/user.model.js
|   |-- routes/
|   |-- utils/token.utils.js
|   |-- validators/auth.validators.js
|   |-- app.js
|   `-- server.js
|-- .env.example
|-- .gitignore
|-- package-lock.json
|-- package.json
|-- README.md
`-- requests.http
```

## API Examples

`requests.http` uses `{{ACCESS_TOKEN}}`, `{{ADMIN_ACCESS_TOKEN}}`, `{{USER_ID}}`, and `{{API_KEY}}` placeholders. Set them in your local REST Client environment; keep real credentials out of this tracked file.

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
