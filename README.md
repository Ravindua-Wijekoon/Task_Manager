# Task Manager

A small full-stack Task Manager. Create, edit, filter, sort and delete tasks.

- **Backend** (`/api`): NestJS, Prisma, SQLite, class-validator
- **Frontend** (`/web`): Next.js (App Router), shadcn/ui, Tailwind CSS

## Features

- REST API for tasks with input validation (400) and not-found handling (404)
- Task table with a coloured status badge
- Create and edit tasks in a dialog (title, description, status, due date)
- Confirmation dialog before deleting
- Loading, error (with retry) and empty states
- Toast message when an action succeeds or fails
- Filter by status and sort by due date
- Docker Compose setup

## Prerequisites

- **Node.js 20.9 or newer** (built and tested with Node 22)
- **npm** (comes with Node.js)
- Docker is optional, only needed for the Docker Compose option

## Run locally

You need two terminals, one for the API and one for the web app. Start the API first.

### 1. Backend (API)

```bash
cd api
npm install
cp .env.example .env
npx prisma migrate deploy
npm run start:dev
```

The API runs at http://localhost:3001.

- `npm install` also generates the Prisma client.
- `npx prisma migrate deploy` creates the SQLite database file (`api/prisma/dev.db`) and its tables.

### 2. Frontend (web)

In a second terminal, starting from the project root:

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment variables

**`api/.env`** (copy from `api/.env.example`)

| Variable       | Default                 | Purpose                                      |
| -------------- | ----------------------- | -------------------------------------------- |
| `DATABASE_URL` | `file:./dev.db`         | SQLite database file (relative to `prisma/`) |
| `PORT`         | `3001`                  | Port the API listens on                      |
| `CORS_ORIGIN`  | `http://localhost:3000` | Web address allowed to call the API          |

**`web/.env.local`** (copy from `web/.env.example`)

| Variable              | Default                 | Purpose                    |
| --------------------- | ----------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Address of the API         |

## Run with Docker Compose (optional)

From the project root:

```bash
docker compose up --build
```

- Web: http://localhost:3000
- API: http://localhost:3001

The database is kept in a Docker volume, so tasks survive restarts. Stop with `Ctrl+C`, and remove everything including the data with `docker compose down -v`.

## API

Base URL: `http://localhost:3001`

| Method | Endpoint     | Description    | Success |
| ------ | ------------ | -------------- | ------- |
| GET    | `/tasks`     | List all tasks | 200     |
| GET    | `/tasks/:id` | Get one task   | 200     |
| POST   | `/tasks`     | Create a task  | 201     |
| PATCH  | `/tasks/:id` | Update a task  | 200     |
| DELETE | `/tasks/:id` | Delete a task  | 204     |

Task fields:

| Field         | Type                                | Notes                             |
| ------------- | ----------------------------------- | --------------------------------- |
| `id`          | number                              | Set by the database               |
| `title`       | string                              | Required, 1-200 characters        |
| `description` | string                              | Optional, up to 2000 characters   |
| `status`      | `TODO`, `IN_PROGRESS` or `DONE`     | Optional, defaults to `TODO`      |
| `dueDate`     | ISO date string, e.g. `2026-12-31`  | Optional                          |
| `createdAt`   | date                                | Set by the database               |

Errors:

- **400** when the input is invalid (missing or empty title, unknown status, bad date, unknown fields, non-numeric id)
- **404** when the task does not exist

Example:

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Write report", "status": "IN_PROGRESS", "dueDate": "2026-12-31"}'
```

## Tests

The API has end-to-end tests for validation and not-found cases. They use a separate database (`api/prisma/test.db`), so your data is not touched.

```bash
cd api
npm run test:e2e
```

## Project structure

```
.
├── api/                    NestJS backend
│   ├── prisma/             Database schema and migrations
│   ├── src/
│   │   ├── prisma/         PrismaService and module
│   │   └── tasks/          Controller, service, DTOs
│   └── test/               End-to-end tests
├── web/                    Next.js frontend
│   └── src/
│       ├── app/            Page and layout
│       ├── components/     Table, dialogs, filters (ui/ holds shadcn components)
│       └── lib/            API client, formatting, filter/sort helpers
└── docker-compose.yml
```

## How I used AI

I used **Claude Code** (Claude Sonnet) as a coding assistant, working with it step by step. The AI wrote most of the code; I directed the process and reviewed the result.

**How I worked with it**

- Before any code was written, I had the assignment broken down into features and phases, with a planned commit for each step.
- Because I am new to NestJS, I asked for each technology (NestJS, Prisma, class-validator, shadcn/ui and so on) to be explained before using it.
- I built the project one phase at a time and made each commit myself, so the git history shows small, separate steps.
- I set the quality rules: no unneeded test files, no leftover boilerplate, and short, plain code comments.
- The AI suggested SQLite with Prisma, npm, and client-side filtering and sorting; I reviewed and approved them.

**What the AI changed along the way**

- Replaced the NestJS 12 scaffold with version 11, because version 12 needs a newer Node.js and failed with the default `npm install`.
- Pinned `@nestjs/config` to version 4 and Prisma to version 6, because the newest versions broke the Jest tests or changed the setup steps.
- Wrote the update DTO by hand instead of using `PartialType`, so `title: null` returns a 400 and not a database crash.
- Removed generated boilerplate (sample controller, default READMEs, demo page) and checked the app with curl, automated tests and a fresh clone.
