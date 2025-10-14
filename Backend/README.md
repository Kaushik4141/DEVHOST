# Lernflow Backend (Express + Clerk + MongoDB)

This service provides cookie-based authentication via Clerk and persists basic user data in MongoDB. Only Google OAuth should be enabled in your Clerk instance.

## Stack
- Express
- @clerk/express (cookie-based sessions)
- MongoDB via Mongoose
- CORS (credentials enabled)

## Environment
Create a `.env` in `Backend/` following `.env.example`:

```
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/lernflow
CORS_ORIGIN=http://localhost:5173
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
# Optional if you want a custom sign-in URL
CLERK_SIGN_IN_URL=
```

Notes:
- Set `CORS_ORIGIN` to your frontend origin. Cookies require `credentials: true` on requests from the frontend.
- Clerk manages session cookies. No manual cookie handling required in this backend.
 

## Install
In the `Backend/` folder:

```
npm i express @clerk/express mongoose cors cookie-parser dotenv morgan helmet
npm i -D nodemon
```

## Run
```
npm run dev
# or
npm start
```
Server runs at `http://localhost:4000` by default.

## Clerk setup (Google OAuth only)
1. In Clerk Dashboard > User & Authentication > Social connections: enable only Google.
2. In Clerk Dashboard > API Keys: copy Publishable and Secret keys into `.env`.
3. If using Clerk-hosted sign-in, set allowed redirect URLs and (optionally) `CLERK_SIGN_IN_URL`.

## CORS and cookies
- Frontend must send credentials on requests:
  - fetch: `fetch(url, { credentials: 'include' })`
  - axios: `axios.get(url, { withCredentials: true })`
- Ensure the frontend origin matches `CORS_ORIGIN` in `.env`.

## Endpoints
- `GET /health` — Service health.
- `GET /auth/me` — Protected. Reads Clerk session from cookie, fetches Clerk user, and upserts into MongoDB with fields:
  - `clerkUserId`, `email`, `username`, `domain` (extracted from email after `@`).
- `GET /user/profile` — Protected. Returns MongoDB profile.
- `PUT /user/profile` — Protected. Updates `username` and/or `domain`.
- `POST /ingest` — Ingestion endpoint. Stores arbitrary JSON in MongoDB:
  - Body: any JSON object; saved into `Ingest.payload` with optional `source`.
  - Optional: `x-ingest-source: <name>` header or `?source=<name>` query.
  - Limits: request body up to ~50MB; MongoDB single-document limit is 16MB (requests exceeding that will return 413).
  - Response: `{ id, createdAt }`.

Example:

```bash
curl -X POST http://localhost:4000/ingest \
  -H "Content-Type: application/json" \
  -H "x-ingest-source: partner-service" \
  --data-binary @big.json
```

## Code map
- `src/server.js` — App bootstrap, middleware, routes.
- `src/config/env.js` — Env loader.
- `src/config/db.js` — Mongoose connection.
- `src/models/User.js` — User schema.
- `src/models/Ingest.js` — Ingested payloads.
- `src/routes/auth.js` — `/auth/me` route.
- `src/routes/user.js` — Profile routes.
- `src/routes/ingest.routes.js` — `/ingest` POST endpoint.

## Testing flow (quick)
1. Start backend and MongoDB.
2. Use your frontend with Clerk SignIn configured for Google (or Clerk-hosted sign-in).
3. After a successful sign-in, Clerk will set session cookies on your frontend's domain. Calls to this backend with credentials will authenticate.
4. Call `GET /auth/me` to sync and read the profile.

## Notes
- If you need TypeScript, we can migrate this to TS quickly (ts-node + types + eslint config).
- For production across subdomains, configure Clerk domain and CORS carefully (HTTPS, sameSite, cookie domain).
