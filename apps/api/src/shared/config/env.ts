import { z } from 'zod'

const bool = z
  .string()
  .optional()
  .transform((v) => v === 'true')

export const envSchema = z.object({
  // App
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'], {
      error: "Must be 'development', 'production' or 'test'",
    })
    .default('development'),

  // Database
  DATABASE_URL: z
    .string()
    .min(
      1,
      'PostgreSQL connection string is required (e.g. postgresql://user:pass@host:5432/db)',
    ),

  // Auth — @app/auth / better-auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(1, 'Required — generate one with: openssl rand -base64 32'),
  BETTER_AUTH_URL: z.url('Must be a valid URL (e.g. http://localhost:3000)'),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),

  // Mail — MailService
  MAIL_HOST: z
    .string()
    .min(1, 'SMTP host is required (e.g. localhost or smtp.sendgrid.net)'),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_SECURE: bool.default(false),
  MAIL_USER: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_FROM_NAME: z.string().default(''),
  MAIL_FROM_EMAIL: z.email(
    'Must be a valid email address (e.g. noreply@example.com)',
  ),

  // Storage — StorageService (MinIO / RustFS)
  RUSTFS_ENDPOINT: z.string().default('localhost'),
  RUSTFS_ACCESS_KEY: z.string().min(1, 'Storage access key is required'),
  RUSTFS_SECRET_KEY: z.string().min(1, 'Storage secret key is required'),
  RUSTFS_API_PORT: z.coerce.number().default(9000),
  RUSTFS_USE_SSL: bool.default(false),
  RUSTFS_BUCKET: z.string().default('app'),
  RUSTFS_REGION: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config)

  if (!result.success) {
    const tree = z.treeifyError(result.error)
    const errors = Object.entries(tree.properties ?? {})
      .map(([key, node]) => `  ${key}: ${node.errors?.join(', ')}`)
      .join('\n')

    console.error(`\n❌  Invalid environment variables:\n\n${errors}\n`)
    process.exit(1)
  }

  return result.data
}
