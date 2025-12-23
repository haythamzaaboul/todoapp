# todoapp

Offline-first todo tracker built to showcase cross-device sync: local SQLite for speed/offline, remote PostgreSQL for shared state, an Electron shell to bundle the UI, and Express APIs on both sides to bridge them.

## Goal
- Let users create and manage todos offline.
- Sync changes to Postgres when online so the same account sees the same data on any device.
- Keep the codebase small, readable, and easy to extend (clean modules, validation, scoped queries).

## Architecture
- **Electron shell** (`main.js`, `public/app.html`): boots a local Express API and hosts the UI; provides file:// access while keeping SQLite local.
- **Local API (SQLite)** (`public/frontend/src`):
  - Routes/controllers/services split: `routes/*.js` wire endpoints, `controllers/*.js` handle HTTP, `services/*.js` talk to SQLite.
  - `loaders/loaders.sqlite.js` sets up the DB and backfills columns to avoid migration breakage.
  - Exposes `/api/tasks` CRUD and `/api/sync` for listing unsynced tasks, importing remote tasks, and marking tasks as synced.
- **Remote API (Postgres)** (`public/backend`):
  - Express loader + pg Pool (`loaders/postgresLoader.js`).
  - Routes: `/api/user` for signup/login/profile, `/api/todo` for CRUD, `/api/todo/sync` for batch sync.
  - Controllers are thin; services hold SQL; middleware handles auth and validation.
- **UI** (`public/app.html`, `public/login.html`): fetches the local API for normal CRUD, calls remote API for cross-device sync, handles manual sync button, filtering, and basic stats.

## Clean, readable, scalable choices
- Layered code: routes → controllers → services; no mixed concerns.
- Input validation with Zod (`middleware/todoValidation.js`, `helpers/validators/*.js`) to keep payloads sane.
- Auth middleware injects `req.user`, and services scope queries by `user_id`.
- SQLite loader adds missing columns at runtime to stay forward-compatible.
- Sync helpers encapsulated (`public/frontend/src/services/sync.services.js`, `public/backend/services/sync.service.js`) to change sync rules without touching controllers/UI.
- Small, focused tests (`public/backend/test/todo.service.test.js`) to lock user scoping and sync SQL shape.

## Data flow and DB interaction
- **Local SQLite**: Tasks live in `items` with `dirty` flag (0 = needs sync, 1 = synced) and optional `remoteId`.
- **Remote Postgres**: Tasks live in `todos` keyed by user; auth data in `users`.
- **Typical loop**:
  1) User creates/updates/deletes locally → SQLite marks `dirty=0` if remote failed, `dirty=1` if remote succeeded.
  2) **Pull**: UI calls remote `/api/todo`, then POSTs those records to local `/api/sync/import`; local upserts by `remoteId` and sets `dirty=1`.
  3) **Push**: UI fetches local `/api/sync` (dirty=0 rows), posts them to remote `/api/todo/sync`, then calls local `/api/sync/mark` to set `dirty=1` for successfully pushed ids.
  4) Stats and lists always render from SQLite for instant, offline-friendly reads.

## Technology choices
- **Electron**: Single packaged app with local file access and bundled server; no browser install friction.
- **SQLite**: Fast, embedded, zero-setup DB ideal for offline cache.
- **PostgreSQL**: Robust relational store with UPSERTs for idempotent sync and multi-user data.
- **Express**: Lightweight HTTP layer on both local and remote sides; identical patterns reduce cognitive load.
- **Zod**: Simple schema validation to protect APIs from bad payloads.
- **JWT + bcrypt**: Standard auth primitives; easy to replace or extend later.

## Authentication
- Remote API issues JWTs on `/api/user/auth`; passwords hashed with bcrypt.
- `Auth` middleware verifies JWT, sets `req.user`, and all todo mutations/sync are scoped by `user_id` in SQL.
- Tokens are stored in `localStorage` client-side; local API trusts the UI but sync endpoints still require tokens for remote calls.

## Sync mechanics (SQLite ↔ Postgres)
- **Dirty flag**: new/updated/deleted local items are `dirty=0` until confirmed synced.
- **Push**: Local `/api/sync` returns dirty items; UI POSTs them to `/api/todo/sync` with auth; on success, UI marks those local ids as `dirty=1`.
- **Pull**: UI GETs `/api/todo`; posts result to local `/api/sync/import`, which upserts by `remoteId`, updating fields and marking `dirty=1`.
- **Conflict stance**: last-write wins per remote response; swap in timestamps/versions inside sync services if stricter rules are needed.

## Setup
1) Install deps:
   - `npm install` (Electron root)
   - `cd public/backend && npm install`
2) Configure Postgres env in `public/backend/config/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=todo_user
   DB_PASSWORD=secret
   DB_NAME=todo_db
   JWT_SECRET=supersecret
   JWT_EXPIRES_IN=3600
   PORT=8040
   ```
3) Run backend: `cd public/backend && node server.js`
4) Run Electron shell (starts local API): `npm start` or `npx electron .`
5) Open `login.html` to sign up/log in, then use `app.html` to manage tasks and hit Sync.

## Tests
- Backend scoping/sync SQL shape: `cd public/backend && npm test`

## Resume highlights
- Offline-first sync loop (SQLite cache ↔ Postgres source) with idempotent upserts and dirty-flag tracking.
- Schema backfills in SQLite to keep older clients running without migrations.
- Auth + validation guardrails: scoped SQL by user, Zod-validated payloads, JWT + bcrypt foundation.
- Modular Express services that keep controllers lean and make future changes (conflict resolution, batching) straightforward.
