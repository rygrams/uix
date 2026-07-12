# prod-dev-boilerplate

Production-ready monorepo boilerplate — NestJS API + React Router v7 web app, shared packages, Docker, and CI/CD out of the box.

## Stack

| Layer          | Technology                                                                        |
| -------------- | --------------------------------------------------------------------------------- |
| Backend        | [NestJS](https://nestjs.com/) (Node 24, TypeScript, DDD + Clean Architecture)     |
| Frontend       | [React Router v7](https://reactrouter.com/) (SSR, TypeScript, Tailwind CSS v4)    |
| Database       | [PostgreSQL 17](https://www.postgresql.org/) via [Prisma](https://www.prisma.io/) |
| Cache / Queue  | [Redis 7](https://redis.io/)                                                      |
| Object storage | [RustFS](https://rustfs.com/) (S3-compatible)                                     |
| Mail (dev)     | [Mailpit](https://mailpit.axllent.org/)                                           |
| Monorepo       | [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/) workspaces           |
| CI/CD          | GitHub Actions (lint · typecheck · test · Docker push)                            |

## Repository structure

```
apps/
  api/          # NestJS backend (DDD + Clean Architecture)
  web/          # React Router v7 frontend (SSR, Tailwind v4)
packages/
  auth/             # better-auth config — createAuth(prisma, mailer) factory
  database/         # Prisma client + schema (shared)
  email-templates/  # React Email templates + renderEmail() helper
  ui/               # Shared React component library (shadcn/ui)
  eslint-config/        # ESLint profiles (base / nest / react)
  typescript-config/    # TypeScript profiles
  vitest-config/        # Vitest profiles
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 24 (use [nvm](https://github.com/nvm-sh/nvm): `nvm use 24`)
- [pnpm](https://pnpm.io/installation) >= 11 (`npm i -g pnpm`)
- [Docker](https://www.docker.com/) + Docker Compose (for local infrastructure)

## Getting started

### 1. Clone and install

```sh
git clone <your-repo-url>
cd prod-dev-boilerplate   # rename this to your project name
pnpm install
```

### 2. Set up environment variables

```sh
cp .env.example .env
```

Edit `.env` if you need different ports. The defaults work out of the box:

| Variable            | Default      | Description            |
| ------------------- | ------------ | ---------------------- |
| `POSTGRES_USER`     | `app`        | PostgreSQL user        |
| `POSTGRES_PASSWORD` | `app`        | PostgreSQL password    |
| `POSTGRES_DB`       | `app`        | PostgreSQL database    |
| `POSTGRES_PORT`     | `5432`       | PostgreSQL host port   |
| `REDIS_PORT`        | `6379`       | Redis host port        |
| `MAILPIT_SMTP_PORT` | `1025`       | Mailpit SMTP port      |
| `MAILPIT_UI_PORT`   | `8025`       | Mailpit web UI port    |
| `RUSTFS_ACCESS_KEY` | `minioadmin` | RustFS access key      |
| `RUSTFS_SECRET_KEY` | `minioadmin` | RustFS secret key      |
| `RUSTFS_API_PORT`   | `9000`       | RustFS S3 API port     |
| `RUSTFS_UI_PORT`    | `9001`       | RustFS console UI port |
| `RUSTFS_BUCKET`     | `app`        | Default storage bucket |
| `API_PORT`          | `3000`       | API host port          |
| `WEB_PORT`          | `3001`       | Web app host port      |

> Each app also has its own `.env` (or `.env.local`). Copy `.env.example` inside each app and fill in the values required by that app.

### 3. Start infrastructure (PostgreSQL, Redis, Mailpit)

```sh
pnpm docker
```

This runs `docker compose -f compose.yml up --build -d` and starts only the infrastructure services (no app containers).

### 4. Set up the database

```sh
pnpm db:generate   # generate the Prisma client
pnpm db:push       # push schema to the local database (dev only)
```

For a proper migration workflow use `pnpm db:migrate` instead of `db:push`.

### 5. Start the development servers

```sh
pnpm dev
```

Turborepo starts both `api` and `web` in watch mode in parallel.

| Service        | URL                                                                  |
| -------------- | -------------------------------------------------------------------- |
| API            | http://localhost:3000                                                |
| API Reference  | http://localhost:3000/reference                                      |
| Web            | http://localhost:3001                                                |
| Mailpit UI     | http://localhost:8025                                                |
| RustFS Console | http://localhost:9001                                                |
| RustFS S3 API  | http://localhost:9000                                                |
| Email preview  | `pnpm --filter @app/email-templates preview` → http://localhost:3002 |
| Prisma Studio  | `pnpm db:studio` → http://localhost:5555                             |

## Common commands

```sh
pnpm dev          # start all apps in watch mode
pnpm build        # build all apps and packages
pnpm test         # run all test suites
pnpm lint         # lint the whole monorepo
pnpm format       # format with Prettier
pnpm check-types  # TypeScript type-check all packages
```

### Database

```sh
pnpm db:generate  # regenerate Prisma client after schema changes
pnpm db:migrate   # create and apply a new migration (dev)
pnpm db:deploy    # apply pending migrations (production)
pnpm db:push      # push schema without migration file (prototyping only)
pnpm db:studio    # open Prisma Studio
```

### Docker

```sh
pnpm docker         # start infrastructure (postgres, redis, mailpit)
pnpm docker:app     # start full stack including app containers (production-like)
```

## CI/CD

Three GitHub Actions workflows are included:

| Workflow    | Trigger                      | What it does                              |
| ----------- | ---------------------------- | ----------------------------------------- |
| **CI**      | push / PR → `main`           | lint, typecheck, test                     |
| **Release** | PR merged → `main`           | creates a semver git tag + GitHub release |
| **Docker**  | after Release · push → `dev` | builds and pushes images to Docker Hub    |

### Docker Hub images

Two images are published per release:

| Branch | Tags                                                                         |
| ------ | ---------------------------------------------------------------------------- |
| `main` | `boilerplate-api:latest`, `boilerplate-api:<version>` · same for `web`       |
| `dev`  | `boilerplate-api:candidate`, `boilerplate-api:<version>-rc` · same for `web` |

### Required GitHub secrets

| Secret                | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `DOCKER_USERNAME`     | Docker Hub username                                          |
| `DOCKER_ACCESS_TOKEN` | Docker Hub access token                                      |
| `DOCKER_HUB_ORG`      | Docker Hub organisation or username (prefix for image names) |

## Adapting this boilerplate to your project

When you use this as a base, update the following:

- **`package.json`** (root) — change `"name": "prod-dev-boilerplate"` to your project name.
- **`compose.yml`** — change `name: prod-dev-boilerplate` to your project name (controls Docker network/volume names).
- **`compose.apps.yml`** — same `name` field.
- **`.github/workflows/docker.yml`** — update the `matrix.app` entries: `name` must match the folder under `apps/`, `image` is the Docker Hub image name.
  ```yaml
  matrix:
    app:
      - { name: api, image: your-project-api }
      - { name: web, image: your-project-web }
  ```
- **`.github/instructions/commit.instructions.md`** — update the scope examples to match your apps and packages.
