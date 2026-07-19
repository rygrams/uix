# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Turborepo + pnpm monorepo (Node >= 24, pnpm 11). Root scripts fan out via `turbo run`; per-app work uses `pnpm --filter <name> <script>`.

The product is a suite of two tools: **UIX**, a graphic design tool (aimed at pixel-perfect designs, leaning more toward Framer than Figma in UI and features, built in `apps/design`), and **Editor**, an agentic coding tool (`apps/editor`) whose objective is to make code easier to read and understand (visualizing it rather than just editing raw text); it will integrate with UIX to build apps from designs.

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

**Local infrastructure**: `pnpm docker` starts PostgreSQL 17, Redis 7, Mailpit (SMTP dev), RustFS (S3-compatible) from `compose.yml`. Infra values (ports, DB/user/bucket named after the `uix` app) are **frozen directly in `compose.yml`** — there is no root `.env`; only host-secret LLM keys (`ANTHROPIC_API_KEY`/`OPENAI_API_KEY` for bifrost) are read from the environment. Each app still has its own `.env`. API on :3000 (Scalar API reference at /reference), web on :3001, Mailpit UI on :8025.

## Architecture

### Apps

- **`apps/api`** — NestJS 11, DDD + Clean Architecture. Backend for the suite. `src/infrastructure/` holds adapters (database, mail, storage via minio, auth), `src/shared/config` holds config. Auth is better-auth mounted through `@thallesp/nestjs-better-auth`.
- **`apps/web`** — the public landing page presenting the two tools (UIX and Editor). React Router v7 (framework mode, SSR) on React 19, Tailwind CSS v4, UI from HeroUI (`@heroui/react`), with `@app/ui` (shadcn) as a secondary fallback for components missing from HeroUI. Typecheck runs `react-router typegen` first (`pnpm --filter web typecheck`).
- **`apps/design`** — **UIX**, the graphic design tool (pixel-perfect designs). Its UI and feature set lean more toward **Framer** than Figma. Started as a copy of `web`, same stack and scripts.
- **`apps/admin`** — management and governance back-office. Same stack as `web`.
- **`apps/editor`** — **Editor**, the **desktop version of UIX** (`apps/design`) with an added **agentic coding agent**: the same graphic-design tool, packaged as a desktop app, that can also generate/edit code from designs so its objective of making code easier to read and understand (a better way to _read_ code, not just edit it) is served alongside design. It has **no `.design/` of its own** — it derives its UI from UIX's design (`apps/design/.design`). The rendering model below (components visualized as `<div>`s carrying `data-component`/`data-component-desc`) is in service of that goal. Electron (electron-vite) with `src/main` / `src/preload` / `src/renderer`. Uses HeroUI (`@heroui/react`) as its design system, same as `web`/`admin`/`design`. Its typecheck script is `typecheck` (two tsconfigs: node + web), and packaging goes through electron-builder (`build:win|mac|linux`). **Rendering model**: the Editor renders UI primarily through `<div>` elements (not real component DOM) — each rendering div carries `data-component` (which component it represents) and `data-component-desc` (its description). Styles are authored in Tailwind class format but the Editor does **not** load the Tailwind stylesheet; a function (e.g. `applyStyles`) resolves the Tailwind classes and mutates the DOM directly (inline/injected styles), so Tailwind is interpreted without shipping its CSS bundle in the rendering surface.
- **`apps/mobile`** — Expo (expo-router), used mainly to preview UIX designs on-device rather than as a full standalone app. UI from HeroUI Native (`heroui-native`). Not wired into turbo tasks; run with `pnpm --filter mobile start|ios|android`.

### Design mockups

`apps/web` and `apps/design` carry a `.design/` directory at their root (`apps/web/.design`, `apps/design/.design`) holding the design mockups (`*.dc.html` files + screenshots). Refer to these mockups when implementing or changing UI in those apps. `apps/admin` has none, and **`apps/editor` has none of its own** — being the desktop build of UIX, it derives its UI from UIX's mockups (`apps/design/.design`).

Treat these mockups as a **UX reference, not a UI spec**: follow their structure, flows, hierarchy, layout, and behaviors faithfully, but **adapt the UI** — render with the app's real design system (HeroUI, `@app/ui`/shadcn as fallback) rather than reproducing the mockup's raw styling (colors, spacing, exact component look) pixel-for-pixel.

### Shared packages (`@app/*`)

- **`packages/database`** — Prisma client + schema, shared by api and auth.
- **`packages/auth`** — better-auth config exposed as a `createAuth(prisma, mailer)` factory.
- **`packages/email-templates`** — React Email templates + `renderEmail()` helper; `pnpm --filter @app/email-templates preview` serves a preview on :3002.
- **`packages/ui`** — shared shadcn/ui component library, the secondary/fallback UI library for `web`/`admin`/`design` (used only for components not covered by HeroUI; not used by `editor`).
- **`packages/validators`** — shared validators and their types, centralized here to avoid duplicating validation logic/types across apps and layers (front/back). Put validators here rather than redefining them per app.
- **`packages/eslint-config` / `typescript-config` / `vitest-config`** — shared config profiles (base / nest / react). New apps extend these rather than defining their own.

### Dependency versions

Versions live in the **pnpm catalog** (`pnpm-workspace.yaml`); package.json entries use `"catalog:"`. Add/update versions in the catalog, not per-package, unless a package genuinely needs a divergent version. Native build scripts must be allowlisted under `allowBuilds` in `pnpm-workspace.yaml`.

### Configuration & secrets

The API's `.env` is reserved for **bootstrap-only** configuration — the values needed before the app can reach its own database. Everything else is runtime configuration, managed from the **admin** back-office and persisted **encrypted** in the database.

- **Stays in the API `.env`** (validated in `apps/api/src/shared/config/env.ts`): **only** authentication (better-auth: `BETTER_AUTH_*`) and the PostgreSQL connection (`DATABASE_URL`), plus the process basics (`PORT`, `NODE_ENV`) and the **master encryption key** used to encrypt/decrypt the stored config. These cannot live in the DB (chicken-and-egg: auth guards the admin, and the DB connection is what would read the config).
- **Managed from admin, encrypted in DB** (everything else — mail/SMTP, storage/RustFS/S3, LLM keys like `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`, Qdrant, and any future integration): the admin app writes these settings through the API; secret values are **encrypted at rest** in the database and **decrypted on read** when the API consumes them, via a dedicated crypto layer keyed by the master encryption key from the env. Do **not** add new env vars for these — add an admin-managed, DB-backed setting instead.

When introducing a new integration, default to the admin-managed/DB-encrypted path; only fall back to an API env var when the value is genuinely required at bootstrap (before DB/auth are available).

## Conventions

Detailed conventions live as project skills in `.claude/skills/` — consult the matching skill before writing code: `backend-conventions` (NestJS layering), `frontend-conventions` (feature-based React structure, servers layer), `heroui-react` (primary UI in `web`/`admin`/`design`/`editor`), `shadcn` (fallback UI in `web`/`admin`/`design` via `@app/ui`), `heroui-native` (UI in `mobile`), `unit-tests` (Vitest, behavior-driven, co-located `__tests__`), `dependency-management`, `docker-conventions`, `code-quality-setup`.

**Commits**: conventional commits with app/package-module scope, e.g. `feat(api/auth): ...`, `fix(ui/select): ...`, `refactor(web/users,api): ...`; imperative lowercase subject, ≤ 72 chars (full spec in `.github.temp/instructions/commit.instructions.md`).

Note: GitHub Actions workflows (CI, release, Docker publish) currently sit in `.github.temp/` — they are not active until renamed to `.github/`.

- Avoid comment in code
