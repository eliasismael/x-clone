# X Clone Codex

A modern social app inspired by X/Twitter, built as a full-stack web application with Next.js, Prisma, and PostgreSQL.

This repository is being developed incrementally. The current state includes the initial application scaffold, database schema foundations, local development tooling, and the first UI shells for authentication and timeline flows.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma
- PostgreSQL
- Vitest

## Why This Stack

- Next.js:
  chosen to keep frontend and backend concerns in a single application, reducing project overhead and making it easier to iterate on UI, server actions, routing, and API endpoints together.
- React:
  used to build a responsive and interactive client experience with a component model that scales well as the timeline, profile, and social interactions grow.
- TypeScript:
  added to improve reliability during rapid iteration, especially across database models, server logic, and UI boundaries.
- Tailwind CSS:
  selected to move quickly on responsive UI work while keeping styling close to components and avoiding early complexity in the design layer.
- Prisma:
  chosen for its developer experience, type-safe database access, and fast iteration when modeling users, tweets, follows, likes, and sessions.
- PostgreSQL:
  used as the primary relational database because it is a strong fit for structured social data, relationships, indexing, and future growth.
- Vitest:
  selected to keep the test loop fast and lightweight while building confidence in utility, domain, and integration behavior from the start.

## Current Status

The project currently includes:

- App Router setup with a custom landing page
- Initial app shell for timeline and auth routes
- Prisma schema for users, sessions, tweets, follows, and likes
- Docker Compose for local PostgreSQL
- Seed script foundation for realistic sample data
- Linting, type-checking, and test setup

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```powershell
Copy-Item .env.example .env.local
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Generate the Prisma client:

```bash
npm run db:generate
```

5. Push the schema to the local database:

```bash
npm run db:push
```

6. Seed sample data:

```bash
npm run db:seed
```

7. Start the development server:

```bash
npm run dev
```

## Useful Scripts

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run db:generate`
- `npm run db:push`
- `npm run db:migrate`
- `npm run db:seed`

## Notes

- Local development uses `.env.local`, created from `.env.example`.
- Prisma scripts are configured to read `.env.local` directly, so the same env file works for both Next.js and Prisma.
- Production or deployed environments should provide real secrets and service-specific configuration.
- Authentication is planned as an app-owned credentials flow backed by database sessions.
- The README will expand as features are implemented, including full setup, seed usage, testing instructions, and architectural decisions.
