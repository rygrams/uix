# @app/auth

Cœur d'authentification partagé du monorepo, basé sur [Better Auth](https://better-auth.com).

Le package expose la **configuration framework-agnostic** de Better Auth. Il ne
contient aucune glue spécifique à un framework (NestJS, etc.) : c'est à l'app
consommatrice de câbler `createAuth` dans sa composition root.

## Exports

```ts
import { createAuth, type Auth, type Session, type User } from '@app/auth'
```

- `createAuth(prisma)` — construit l'instance Better Auth liée à un `PrismaClient`.
- `Auth` — type de l'instance retournée par `createAuth`.
- `Session` / `User` — types inférés de la session et de l'utilisateur, à partager
  côté back **et** front pour des sessions typées.

## Usage

L'app fournit son propre `PrismaClient` (via `@app/database`) :

```ts
import { createAuth } from '@app/auth'
import { prisma } from './prisma'

export const auth = createAuth(prisma)
```

Exemple NestJS : voir `apps/api/src/infrastructure/auth/auth.module.ts`.

## Contrat d'environnement

Ce package **ne charge aucun `.env`** : il lit `process.env` du **process hôte**
(l'app qui l'importe). Les variables ci-dessous doivent donc être définies dans
l'environnement de l'app consommatrice (cf. `apps/api/.env.example`).

| Variable                      | Requis | Rôle                                                                               |
| ----------------------------- | :----: | ---------------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`          |   ✅   | Secret de signature des sessions/tokens.                                           |
| `BETTER_AUTH_URL`             |   ✅   | URL de base publique de l'API (callbacks).                                         |
| `BETTER_AUTH_TRUSTED_ORIGINS` |   ⚪   | Origines autorisées (CSV). Si vide hors prod, fallback sur des origines localhost. |
| `NODE_ENV`                    |   ⚪   | `production` durcit les défauts (trusted origins vides, secrets non loggués).      |
