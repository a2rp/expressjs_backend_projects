# Node.js Redis Cache Example

A small Express API that fetches product data from DummyJSON and caches the response in Redis for a configurable time. Redis is optional: when it is not configured or unavailable, the API still serves data from the upstream service.

## Requirements

- Node.js 20 or newer
- npm
- A Redis instance (optional)

## Run locally

```sh
cp .env.example .env
npm ci
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` in place of `cp`.

The API listens at `http://127.0.0.1:3000` by default. Add Redis connection details to `.env` to enable caching. Set either `REDIS_URL` (for example, a `rediss://` URL for TLS) or `REDIS_CLOUD_HOST`, `REDIS_CLOUD_PORT`, and `REDIS_CLOUD_PASSWORD`. Set `REDIS_TLS=true` when using the separate host settings with TLS.

`CACHE_TTL_SECONDS` controls how long the `products` cache entry lives; it defaults to 10 seconds.

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/a2rp` | Returns a small health-style response |
| `GET` | `/api/products` | Fetches products, using Redis when available |
| `GET` | `/api/get-products` | Backward-compatible alias for `/api/products` |

Product responses include `source: "cache"` or `source: "upstream"` so you can see where the result came from. `rest.http` contains sample requests for REST Client.

## Redis behavior

The app listens for Redis client errors, falls back to the upstream API when Redis cannot be reached, and treats cache read/write failures as non-fatal. Keep real connection strings and passwords in `.env`; do not commit them.
