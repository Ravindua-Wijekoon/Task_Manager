# Task Manager

A small full-stack Task Manager. Create, edit, filter, sort and delete tasks.

- **Backend** (`/api`): NestJS, Prisma, SQLite, class-validator
- **Frontend** (`/web`): Next.js (App Router), shadcn/ui, Tailwind CSS

## Features

**Tasks**
- Create and edit tasks in a dialog (title, description, status, due date)
- Confirmation dialog before deleting
- Toast message (light green or red) when an action succeeds or fails
- Loading skeletons, an error state with a retry button, and empty states

**Two ways to view tasks**
- **Cards** (default): each card is colour-coded by status (grey for To do, blue for In progress, green for Done), with the due date, a short description and Edit / Delete buttons
- **Table**: a status badge on every row and sticky column headings
- Switch between them with the Table / Cards buttons

**Filter and sort**
- Filter by status
- Quick due-date chips: All, This week, This month
- A Clear filters button (also shown when no task matches)
- Sort by clicking the Title, Status, Due date or Created heading in the table, or with the sort dropdown in card view
- Overdue due dates are shown in red

**Interface**
- Only the task list scrolls; the title, filters and buttons stay in place
- A glass-style down arrow appears when there are more tasks below
- Light gray page background and the DM Sans font

**Backend and setup**
- REST API for tasks with input validation (400) and not-found handling (404)
- End-to-end API tests
- Optional seed script with 12 sample tasks
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
npm run seed          # optional: adds 12 sample tasks
npm run start:dev
```

The API runs at http://localhost:3001.

- `npm install` also generates the Prisma client.
- `npx prisma migrate deploy` creates the SQLite database file (`api/prisma/dev.db`) and its tables.
- `npm run seed` is optional. It adds 12 sample tasks, and does nothing if the database already has tasks.

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
│   ├── prisma/             Database schema, migrations and seed script
│   ├── src/
│   │   ├── prisma/         PrismaService and module
│   │   └── tasks/          Controller, service, DTOs
│   └── test/               End-to-end tests
├── web/                    Next.js frontend
│   └── src/
│       ├── app/            Page and layout
│       ├── components/     Cards, table, dialogs, filters (ui/ holds shadcn components)
│       └── lib/            API client, date formatting, filter and sort logic
└── docker-compose.yml
```

## How I Approached the Development

I used Claude Code as a supporting development tool during the project. Since I was relatively new to NestJS, I used it to understand unfamiliar concepts, explore implementation approaches, troubleshoot issues, and improve my development workflow.

**My development approach**

- Started by understanding the assignment requirements and breaking the work into manageable features and development phases.
- Planned the implementation step by step, keeping the codebase organised and maintaining separate Git commits for each major stage.
- Focused on understanding the technologies used, including NestJS, Prisma, class-validator, and shadcn/ui, before applying them to the project.
- Made key technical decisions and reviewed implementation suggestions before incorporating them into the application.
- Maintained code quality by removing unnecessary boilerplate, avoiding redundant files, and keeping comments short and meaningful.
- Tested and verified API endpoints using Postman, checking request handling, response structures, validation rules, HTTP status codes, and error handling.
- Used automated tests and a fresh project clone to verify application functionality and ensure the setup process worked correctly.

**Technical decisions and improvements**

During development, I encountered several compatibility and implementation issues that required adjustments:

- Used NestJS 11 instead of the initially generated version 12 to maintain compatibility with the available Node.js environment.
- Selected stable versions of Prisma and @nestjs/config to avoid setup and testing compatibility issues.
- Implemented the update DTO manually instead of using PartialType to ensure that invalid values, such as title: null, are rejected through proper validation rather than causing database errors.
- Used SQLite with Prisma for database management and implemented client-side filtering and sorting based on the project requirements.

Overall, I used AI as a development assistant for guidance and troubleshooting while taking responsibility for understanding the implementation, reviewing technical decisions, managing the development process, testing the APIs, and verifying the final application.