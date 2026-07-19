# uix

UIX — a suite of two tools: **UIX**, a pixel-perfect graphic design tool (leaning more toward Framer than Figma), and **Editor**, an agentic coding tool that integrates with UIX to build apps from designs. This is the Turborepo + pnpm monorepo backing the suite — NestJS API, React Router v7 apps, an Electron editor, shared packages, and Docker infrastructure.

## Stack

| Layer          | Technology                                                                        |
| -------------- | --------------------------------------------------------------------------------- |
| Backend        | [NestJS](https://nestjs.com/) (Node 24, TypeScript, DDD + Clean Architecture)     |
| Frontend       | [React Router v7](https://reactrouter.com/) (SSR, TypeScript, Tailwind CSS v4)    |
| Desktop        | [Electron](https://www.electronjs.org/) (electron-vite) for the Editor            |
| Mobile         | [Expo](https://expo.dev/) (expo-router) for on-device design previews             |
| UI             | [HeroUI](https://www.heroui.com/) (`@heroui/react`), `@app/ui` (shadcn) fallback  |
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
  web/          # React Router v7 landing page presenting UIX + Editor
  design/       # UIX — the pixel-perfect graphic design tool
  editor/       # Editor — the agentic coding tool (Electron)
  admin/        # management & governance back-office
  mobile/       # Expo app for previewing UIX designs on-device
packages/
  auth/             # better-auth config — createAuth(prisma, mailer) factory
  database/         # Prisma client + schema (shared)
  email-templates/  # React Email templates + renderEmail() helper
  ui/               # Shared React component library (shadcn/ui) — fallback UI
  validators/       # Shared validators and their types
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
cd uix
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

Turborepo starts the apps wired into turbo (api + web + admin + editor) in watch mode in parallel. `mobile` is not wired into turbo — run it with `pnpm --filter mobile start|ios|android`.

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

Three GitHub Actions workflows are included (currently under `.github.temp/`, not active until renamed to `.github/`):

| Workflow    | Trigger                      | What it does                              |
| ----------- | ---------------------------- | ----------------------------------------- |
| **CI**      | push / PR → `main`           | lint, typecheck, test                     |
| **Release** | PR merged → `main`           | creates a semver git tag + GitHub release |
| **Docker**  | after Release · push → `dev` | builds and pushes images to Docker Hub    |

### Docker Hub images

Images are published per release:

| Branch | Tags                                                                 |
| ------ | -------------------------------------------------------------------- |
| `main` | `uix-api:latest`, `uix-api:<version>` · same for `web`               |
| `dev`  | `uix-api:candidate`, `uix-api:<version>-rc` · same for `web`         |

### Required GitHub secrets

| Secret                | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `DOCKER_USERNAME`     | Docker Hub username                                          |
| `DOCKER_ACCESS_TOKEN` | Docker Hub access token                                      |
| `DOCKER_HUB_ORG`      | Docker Hub organisation or username (prefix for image names) |
