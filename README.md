# Backend Examples

A collection of practical backend APIs kept as isolated projects. Each app owns its source, dependencies, configuration, and run instructions.

## Repository layout

    apps/
    |-- basic-jwt-auth-api/          runnable example
    |-- bookmark-manager-api/        runnable example
    |-- contact-form-api/            runnable example
    |-- http-only-cookie-auth/       scaffold
    |-- newsletter-subscription-api/ runnable example
    |-- notes-api/                   runnable example
    |-- refresh-token-auth-api/      runnable example
    |-- task-manager-api/            runnable example
    |-- authentication-system/          runnable example
    |-- authorization-security-api/          runnable example
    |-- aws-app1-backend/                    example
    |-- basic-nodejs-expressjs-hello-app/                    example
    |-- crud-api/                    example
    |-- database-engineering-api/                    example
    |-- ecommerce-backend/                    example
    |-- express-backend-lab/                    example
    |-- express-basic-server/                    example
    |-- express-project-01-hello-world-api/                    example
    |-- express-project-02-static-response-api/                    example
    |-- express-project-03-route-params-api/                    example
    |-- express-project-04-query-filter-api/                    example
    |-- express-project-05-request-logger-middleware/                    example
    `-- user-profile-api/            example

## Run the Basic JWT Auth API

Requirements: Node.js 20.19 or newer and a local MongoDB instance or MongoDB Atlas database.

    git clone https://github.com/a2rp/backend-examples.git
    cd backend-examples/apps/basic-jwt-auth-api
    npm install

Copy .env.example to .env, add a MongoDB URI, and set JWT_SECRET to a random secret of at least 32 bytes. Then start the API:

    npm run dev

The API listens on http://localhost:1198 by default. See the app README at apps/basic-jwt-auth-api/README.md for endpoint details and the included requests.rest file for sample requests.

## Run the Bookmark Manager API

Requirements: Node.js 20.19 or newer and a local MongoDB instance or MongoDB Atlas database.

    cd apps/bookmark-manager-api
    npm install

Copy apps/bookmark-manager-api/.env.example to .env in that app folder. Configure MONGO_URI, set JWT_SECRET to a unique random value of at least 32 characters, and set CLIENT_ORIGIN to your frontend origin.

    npm run dev

The API listens on http://localhost:1206 by default. See apps/bookmark-manager-api/README.md and apps/bookmark-manager-api/rest.http for endpoint details and sample requests.

## Run the Contact Form API

Requirements: Node.js 20.19 or newer and a local MongoDB instance or MongoDB Atlas database.

    cd apps/contact-form-api
    npm install

Copy apps/contact-form-api/.env.example to .env in that app folder. Configure MONGO_URI, set JWT_SECRET and ADMIN_REGISTRATION_SECRET to separate random values of at least 32 characters, and set CLIENT_ORIGIN to your frontend origin.

    npm run dev

The API listens on http://localhost:1198 by default. See apps/contact-form-api/README.md and apps/contact-form-api/rest.http for endpoint details and sample requests.

## Run the Newsletter Subscription API

Requirements: Node.js 20.19 or newer and a local MongoDB instance or MongoDB Atlas database.

    cd apps/newsletter-subscription-api
    npm install

Copy `.env.example` to `.env` in this app folder. Configure `MONGO_URI`, then replace `JWT_SECRET`, `ADMIN_REGISTRATION_SECRET`, and `UNSUBSCRIBE_SECRET` with separate random secrets of at least 32 characters. Set `CLIENT_ORIGINS` to your trusted frontend origin(s); production requires both `CLIENT_ORIGINS` and `UNSUBSCRIBE_SECRET`.

    npm run dev

The API listens on http://localhost:1198 by default. Register the initial admin with the `x-admin-registration-secret` header, then use the admin cookie to list active subscribers. Public users can subscribe and unsubscribe with a signed email token. See `apps/newsletter-subscription-api/README.md` and `apps/newsletter-subscription-api/rest.http` for full setup and endpoint details.

## Run the Notes API

Requirements: Node.js 20.19 or newer and a local MongoDB instance or MongoDB Atlas database.

    cd apps/notes-api
    npm install

Copy `.env.example` to `.env` in the app folder. Configure `MONGO_URI`, replace `JWT_SECRET` with a unique random secret of at least 32 characters, and set `CLIENT_ORIGINS` to the trusted frontend origin(s).

    npm run dev

The API listens on http://localhost:1198 by default. It demonstrates cookie-based JWT authentication and user-owned notes CRUD. See `apps/notes-api/README.md` and `apps/notes-api/rest.http` for endpoint details and sample requests.

## Run the Refresh Token Auth API

Requirements: Node.js 20.19 or newer and a local MongoDB instance or MongoDB Atlas database.

    cd apps/refresh-token-auth-api
    npm install

Copy `.env.example` to `.env` in the app folder. Configure `MONGO_URI`, set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to different unique random secrets of at least 32 characters, and set `CLIENT_ORIGINS` to the trusted frontend origin(s).

    npm run dev

The API listens on http://localhost:1198 by default. It demonstrates short-lived access tokens, rotating refresh tokens, and refresh-token reuse detection. See `apps/refresh-token-auth-api/README.md` and `apps/refresh-token-auth-api/rest.http` for endpoint details and sample requests.

## Run the Task Manager API

Requirements: Node.js 20.19 or newer and a local MongoDB instance or MongoDB Atlas database.

    cd apps/task-manager-api
    npm install

Copy `.env.example` to `.env` in this app folder. Configure `MONGO_URI`, set `JWT_SECRET` to a unique random secret of at least 32 characters, and set `CLIENT_ORIGINS` to the trusted frontend origin(s).

    npm run dev

The API listens on http://localhost:1198 by default. It demonstrates cookie-based JWT authentication and user-owned task CRUD. See `apps/task-manager-api/README.md` and `apps/task-manager-api/rest.http` for endpoint details and sample requests.

The remaining scaffold folders are being prepared as separate examples. Backend engineering study notes are maintained in the notes repository.

## License

Each app includes its own license and reuse terms.
