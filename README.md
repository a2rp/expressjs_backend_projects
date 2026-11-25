# Backend Examples

A collection of practical backend APIs kept as isolated projects. Each app owns its source, dependencies, configuration, and run instructions.

## Repository layout

    apps/
    |-- basic-jwt-auth-api/          runnable example
    |-- bookmark-manager-api/        scaffold
    |-- contact-form-api/            scaffold
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

Other app folders are being prepared as separate examples. Backend engineering study notes are maintained in the notes repository.

## License

Each app includes its own license and reuse terms.
