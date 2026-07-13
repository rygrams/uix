# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Turborepo + pnpm monorepo (Node >= 24, pnpm 11). Root scripts fan out via `turbo run`; per-app work uses `pnpm --filter <name> <script>`.

The product is a suite of two tools: **UIX**, a graphic design tool (Figma-like, aimed at pixel-perfect designs, built in `apps/design`), and **Editor**, an agentic coding tool (`apps/editor`) that will integrate with UIX to build apps from designs.

## Commands

```sh
pnpm dev            # all apps in watch mode (api + web + admin + editor)
pnpm build          # build everything
pnpm lint           # lint everything
pnpm check-types    # typecheck everything
pnpm test           # all test suites (Vitest)
pnpm format         # Prettier
```

Scoped to one app/package: `pnpm --filter api dev`, `pnpm --filter web test`, etc.

**Single test**: run Vitest directly in the package, e.g. `pnpm --filter api exec vitest run src/path/to/file.spec.ts` (or `test:watch` for watch mode). The API also has `test:e2e` (separate `vitest.config.e2e.mts`).

**Database (Prisma, in `packages/database`)**: `pnpm db:generate` (regenerate client after schema change), `pnpm db:migrate` (dev migration), `pnpm db:push` (prototyping only), `pnpm db:deploy` (prod), `pnpm db:studio`.

**Local infrastructure**: `pnpm docker` starts PostgreSQL 17, Redis 7, Mailpit (SMTP dev), RustFS (S3-compatible) from `compose.yml`. Root `.env` (copy `.env.example`) sets ports; each app also has its own `.env`. API on :3000 (Scalar API reference at /reference), web on :3001, Mailpit UI on :8025.

## Architecture

### Apps

- **`apps/api`** — NestJS 11, DDD + Clean Architecture. Backend for the suite. `src/infrastructure/` holds adapters (database, mail, storage via minio, auth), `src/shared/config` holds config. Auth is better-auth mounted through `@thallesp/nestjs-better-auth`.
- **`apps/web`** — the public landing page presenting the two tools (UIX and Editor). React Router v7 (framework mode, SSR) on React 19, Tailwind CSS v4, UI from `@app/ui`. Typecheck runs `react-router typegen` first (`pnpm --filter web typecheck`).
- **`apps/design`** — **UIX**, the graphic design tool (Figma-like, pixel-perfect designs). Started as a copy of `web`, same stack and scripts.
- **`apps/admin`** — management and governance back-office. Same stack as `web`.
- **`apps/editor`** — **Editor**, the agentic coding tool; will link with UIX to build apps. Electron (electron-vite) with `src/main` / `src/preload` / `src/renderer`. Uses Fluent UI v9 as its design system (not `@app/ui`). Its typecheck script is `typecheck` (two tsconfigs: node + web), and packaging goes through electron-builder (`build:win|mac|linux`).
- **`apps/mobile`** — Expo (expo-router). Not wired into turbo tasks; run with `pnpm --filter mobile start|ios|android`.

### Design mockups

Every app with a UI **except `admin`** carries a `.design/` directory at its root (`apps/web/.design`, `apps/design/.design`, `apps/editor/.design`) holding the design mockups (`*.dc.html` files + screenshots). Refer to these mockups when implementing or changing UI in those apps.

### Shared packages (`@app/*`)

- **`packages/database`** — Prisma client + schema, shared by api and auth.
- **`packages/auth`** — better-auth config exposed as a `createAuth(prisma, mailer)` factory.
- **`packages/email-templates`** — React Email templates + `renderEmail()` helper; `pnpm --filter @app/email-templates preview` serves a preview on :3002.
- **`packages/ui`** — shared shadcn/ui component library (used by web + admin, not editor).
- **`packages/eslint-config` / `typescript-config` / `vitest-config`** — shared config profiles (base / nest / react). New apps extend these rather than defining their own.

### Dependency versions

Versions live in the **pnpm catalog** (`pnpm-workspace.yaml`); package.json entries use `"catalog:"`. Add/update versions in the catalog, not per-package, unless a package genuinely needs a divergent version. Native build scripts must be allowlisted under `allowBuilds` in `pnpm-workspace.yaml`.

## Conventions

Detailed conventions live as project skills in `.claude/skills/` — consult the matching skill before writing code: `backend-conventions` (NestJS layering), `frontend-conventions` (feature-based React structure, servers layer), `fluentui-v9` (editor UI), `unit-tests` (Vitest, behavior-driven, co-located `__tests__`), `dependency-management`, `docker-conventions`, `code-quality-setup`.

**Commits**: conventional commits with app/package-module scope, e.g. `feat(api/auth): ...`, `fix(ui/select): ...`, `refactor(web/users,api): ...`; imperative lowercase subject, ≤ 72 chars (full spec in `.github.temp/instructions/commit.instructions.md`).

Note: GitHub Actions workflows (CI, release, Docker publish) currently sit in `.github.temp/` — they are not active until renamed to `.github/`. The README still describes the original api+web boilerplate; admin, editor, and mobile were added on top.
