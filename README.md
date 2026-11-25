# Backend Examples

A collection of practical backend APIs kept as isolated projects. Each app owns its source, dependencies, configuration, and run instructions.

## Repository layout

    apps/
    |-- basic-jwt-auth-api/          runnable example
    |-- bookmark-manager-api/        runnable example
    |-- contact-form-api/            runnable example
    |-- http-only-cookie-auth/       scaffold
    |-- newsletter-subscription-api/ scaffold
    |-- notes-api/                   scaffold
    |-- refresh-token-auth-api/      scaffold
    |-- task-manager-api/            scaffold
    `-- user-profile-api/            scaffold

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

The remaining app folders are being prepared as separate examples. Backend engineering study notes are maintained in the notes repository.

## License

Each app includes its own license and reuse terms.
