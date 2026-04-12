# x-clone

A full-stack Twitter/X clone built as a technical challenge. Implements the core social features: authentication, tweets, timeline, likes, follows, search, and user profiles.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma 6 |
| Styling | Tailwind CSS 4 |
| Unit/Integration tests | Vitest + Testing Library |
| E2E tests | Playwright |
| Runtime | Node.js 20+ |

## Why this stack

**Next.js** keeps frontend and backend in a single repo. Server Actions handle mutations without a separate API layer, and React Server Components fetch data directly — no REST boilerplate, no client/server boundary to coordinate. This compresses development time significantly.

**Prisma** provides type-safe database access with first-class TypeScript support. Schema migrations, the query builder, and generated types all align with the incremental commit-by-feature workflow used here.

**PostgreSQL** is the natural choice for a social graph. Composite primary keys on `follows` and `likes` enforce uniqueness at the DB level; indexes on `(authorId, createdAt DESC)` make timeline queries fast.

**Vitest** shares the same config and module resolution as the app, so server action tests run without extra build steps. Testing Library covers interactive components. Playwright handles the full auth E2E flow.

---

## Runbook

### Prerequisites

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **Docker** (for PostgreSQL) — [docker.com](https://docker.com)
- **npm 10+** (bundled with Node)

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd x-clone-codex

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Start PostgreSQL
docker compose up -d

# 5. Generate Prisma client
npm run db:generate

# 6. Push schema to the database
npm run db:push

# 7. Seed with sample data
npm run db:seed

# 8. Start the development server
npm run dev
```

The app is now running at **http://localhost:3000**.

### Sample credentials

After seeding, any of the following accounts can be used to log in:

| Email | Password |
|-------|----------|
| `user1@example.com` | `Password123!` |
| `user2@example.com` | `Password123!` |

All 10 seed users share the same password. The seed creates cross-follows and cross-likes, so `user1`'s timeline will have content immediately.

### Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/x_clone?schema=public` |
| `AUTH_SECRET` | Secret used to sign session tokens | Any long random string |
| `APP_URL` | Public base URL of the app | `http://localhost:3000` |

### Running tests

```bash
# Unit and integration tests (with coverage report)
npm run test

# Watch mode during development
npm run test:watch

# End-to-end tests (requires the dev server to be running)
npm run dev        # in one terminal
npm run test:e2e   # in another
```

Current coverage: **98.5%** across all lib modules and server actions.

### Other scripts

```bash
npm run build       # Production build
npm run lint        # ESLint
npm run typecheck   # TypeScript type check
npm run db:migrate  # Create a new Prisma migration
npm run db:seed     # Re-seed the database (destructive — clears existing data)
```

---

## Architecture decisions

### Timeline model

The timeline query uses a Prisma `OR` clause:

```
tweets WHERE authorId = me OR author.followers.some(followerId = me)
```

Pagination uses a **cursor** strategy (`createdAt` + `id` composite) rather than `OFFSET`. This avoids the classic offset drift problem where new tweets shift rows between page fetches, which would cause duplicates or gaps in an infinite scroll feed.

### Follow graph

Follows are stored in a `Follow` table with a composite primary key `[followerId, followingId]`. This enforces uniqueness at the database level (no duplicate follows possible even under concurrent requests) and makes `isFollowing` checks a simple indexed lookup.

### Authentication

Auth is fully app-owned — no third-party service:

1. Passwords are hashed with **bcrypt** (cost factor 10) before storage.
2. On login, a 256-bit random token is generated, hashed with SHA-256, and stored in a `sessions` table with an expiry.
3. The raw token (not the hash) is placed in an **HttpOnly, SameSite=Lax** cookie.
4. On each request, the cookie token is hashed and looked up in the DB. Expired sessions are cleaned up on access.

This approach means sessions can be invalidated server-side (e.g., on logout or security events) and credentials never leave the server.

### Avatar uploads

Avatars are stored in `public/uploads/avatars/` during development. The file is written server-side via a Server Action, which validates MIME type and file size (max 2 MB) before writing. Old avatar files are deleted when replaced. In a production deployment this would be replaced with object storage (S3, R2, etc.) — the current approach is intentional for simplicity within the challenge scope.

### Trade-offs and known limitations

- **Avatar storage is local** — files are lost on server restart in containerized environments. Acceptable for local dev and the challenge, not for production.
- **No real-time updates** — the timeline refreshes only on navigation. A WebSocket or SSE layer would be the next step.
- **Session table grows unboundedly** — expired sessions are only cleaned up on access by the owning user. A background job should periodically prune expired rows.
- **Search is full-table `ILIKE`** — works well up to tens of thousands of users. At scale this would need a dedicated search index (PostgreSQL `pg_trgm`, Elasticsearch, etc.).

### AI tools used

- **OpenAI Codex** — used to establish the initial architecture: set the stack, designed the DB schema, and generated the first scaffolding commit. Codex provided the commit-by-feature plan that drove the development sequence.
- **Claude Code (Anthropic)** — used for all feature implementation commits after the scaffold. Each feature (auth, tweets, timeline, likes, follows, profiles, search) was implemented incrementally with Claude Code, reviewing and adjusting output at each step.