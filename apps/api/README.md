# API

NestJS backend following DDD + Clean Architecture.

## Architecture

```
src/
  infrastructure/       # Services tiers (DB, mail, storage, auth)
    database/           # PrismaService
    mail/               # MailService — nodemailer wrapper
    storage/            # StorageService — MinIO / RustFS
    auth/               # AuthModule — better-auth bridge
  presentations/        # HTTP controllers, workers, consumers
  shared/
    config/
      env.ts            # Zod schema — validates all env vars at startup
```

Domain modules live under `src/domains/` as the codebase grows. Each module is a NestJS module with use-cases, repository interfaces, and mappers — no framework imports.

## Environment variables

All variables are validated with Zod at startup (`src/shared/config/env.ts`). The app exits with a clear error if any required variable is missing or malformed.

```sh
cp .env.example .env
```

| Variable                      | Required | Default       | Description                                        |
| ----------------------------- | -------- | ------------- | -------------------------------------------------- |
| `PORT`                        |          | `3000`        | HTTP port                                          |
| `NODE_ENV`                    |          | `development` | `development` / `production` / `test`              |
| `DATABASE_URL`                | ✓        | —             | PostgreSQL connection string                       |
| `BETTER_AUTH_SECRET`          | ✓        | —             | Session signing secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL`             | ✓        | —             | Public API URL (e.g. `http://localhost:3000`)      |
| `BETTER_AUTH_TRUSTED_ORIGINS` |          | —             | Comma-separated allowed origins                    |
| `MAIL_HOST`                   | ✓        | —             | SMTP host (e.g. `localhost`)                       |
| `MAIL_PORT`                   |          | `587`         | SMTP port                                          |
| `MAIL_SECURE`                 |          | `false`       | Use TLS (`true` / `false`)                         |
| `MAIL_USER`                   |          | —             | SMTP username (omit for Mailpit)                   |
| `MAIL_PASSWORD`               |          | —             | SMTP password (omit for Mailpit)                   |
| `MAIL_FROM_NAME`              |          | `""`          | Sender display name                                |
| `MAIL_FROM_EMAIL`             | ✓        | —             | Sender address (e.g. `noreply@example.com`)        |
| `RUSTFS_ENDPOINT`             |          | `localhost`   | S3-compatible storage endpoint                     |
| `RUSTFS_ACCESS_KEY`           | ✓        | —             | Storage access key                                 |
| `RUSTFS_SECRET_KEY`           | ✓        | —             | Storage secret key                                 |
| `RUSTFS_API_PORT`             |          | `9000`        | Storage API port                                   |
| `RUSTFS_USE_SSL`              |          | `false`       | Use HTTPS for storage                              |
| `RUSTFS_BUCKET`               |          | `app`         | Default bucket name                                |
| `RUSTFS_REGION`               |          | —             | Storage region (optional)                          |

## Mail

`MailService` (`src/infrastructure/mail/`) wraps nodemailer. It reads SMTP config from env vars and creates the transporter once at startup.

Email content is rendered by `@app/email-templates` before being passed to `MailService.send()`. Auth-triggered emails (verification, password reset) are wired in `AuthModule`.

```ts
// Inject anywhere
constructor(private readonly mail: MailService) {}

await this.mail.send({ to, subject, html, text })
```

To preview templates without sending:

```sh
pnpm --filter @app/email-templates preview
# → http://localhost:3002
```

## Auth

Authentication is handled by [better-auth](https://better-auth.com) via `@app/auth`. The NestJS bridge lives in `src/infrastructure/auth/auth.module.ts` and wires `PrismaService` + `MailService` into the auth factory:

- **Sign-up** → sends a verification email via `@app/email-templates` `WelcomeEmail`
- **Forgot password** → sends a reset link via `ResetPasswordEmail`

## API Reference

Interactive documentation powered by [Scalar](https://scalar.com) is served at `/reference`.

```
http://localhost:3000/reference
```

The OpenAPI spec is generated automatically from NestJS decorators (`@ApiOperation`, `@ApiProperty`, etc.) via `@nestjs/swagger`.

## Commands

```sh
pnpm --filter api dev       # start in watch mode
pnpm --filter api build     # compile to dist/
pnpm --filter api test      # run unit tests
pnpm --filter api test:e2e  # run e2e tests
```
