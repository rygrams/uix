FROM node:24.13.1-alpine@sha256:4f696fbf39f383c1e486030ba6b289a5d9af541642fc78ab197e584a113b9c03 AS base

RUN apk add --no-cache libc6-compat
RUN corepack enable
RUN npm install -g turbo@^2

# Isole web (et ses deps internes) du monorepo dans /app/out
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune web --docker

# Installe les deps puis build à partir du workspace élagué
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --include-workspace-root

COPY --from=builder /app/out/full/ .

RUN pnpm turbo run build --filter=web...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 reactrouter

COPY --from=installer --chown=reactrouter:nodejs /app .
COPY --chown=reactrouter:nodejs apps/web/entrypoint.sh ./entrypoint.sh

# Élague les devDependencies pour une image finale légère
ENV CI=true
RUN pnpm install --prod --frozen-lockfile
RUN chmod +x ./entrypoint.sh

USER reactrouter

WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
