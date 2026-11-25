# Backend Examples

A home for practical backend APIs and service examples, collected from separate projects into one repository. Each example will stay isolated so its source, dependencies, configuration, and setup instructions remain easy to follow.

## Repository layout

Each backend project will live in its own folder under `apps/`:

```text
apps/
├── basic-jwt-auth-api/
├── bookmark-manager-api/
├── contact-form-api/
├── http-only-cookie-auth/
├── newsletter-subscription-api/
├── notes-api/
├── refresh-token-auth-api/
├── task-manager-api/
└── user-profile-api/
```

Each app keeps its own entry point and dependencies. A typical project will look like this:

```text
example-name/
├── src/
├── .env.example
├── package.json
└── README.md
```

The repository is being initialized first; the examples will be added in follow-up updates.

## Run an example

Open the selected app folder, install its dependencies, then follow that app's README and scripts. For a Node.js app, the first steps will usually be:

```bash
cd apps/<example-name>
npm install
```

Copy `.env.example` to `.env` and fill in local values when the app requires environment variables. Never commit real credentials or production secrets.

## Examples planned

- Basic JWT authentication API
- Bookmark manager API
- Contact form API
- HttpOnly cookie authentication
- Newsletter subscription API
- Notes API
- Refresh token authentication API
- Task manager API
- User profile API

Backend engineering study notes are maintained separately from these runnable API examples.

## License

Each example will include its license and attribution details when it is added. Check the individual project before reusing its code.
