# `@app/vitest-config`

Configurations Vitest partagées du monorepo, une par profil :

- `@app/vitest-config/base` — config commune (globals, coverage v8).
- `@app/vitest-config/node` — environnement `node` (back-end NestJS).
- `@app/vitest-config/react` — environnement `jsdom` (front React).

## Usage

```ts
// apps/api/vitest.config.ts
import { nodeConfig } from '@app/vitest-config/node'

export default nodeConfig
```
