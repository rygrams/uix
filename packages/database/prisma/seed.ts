import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { hashPassword } from 'better-auth/crypto'
import { z } from 'zod'
import { createPrismaClientOptions } from '../src/client'
import { encryptSecret } from '../src/crypto'
import { PrismaClient, SettingCategory } from '../src/generated/prisma/client'

const prisma = new PrismaClient(createPrismaClientOptions())

const PATTERN = {
  PORT: '^\\d+$',
  BOOL: '^(true|false)$',
  EMAIL: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
} as const

const settingSchema = z
  .object({
    category: z.enum(SettingCategory),
    key: z.string().min(1),
    value: z.string(),
    secret: z.boolean().default(false),
    pattern: z.string().optional(),
  })
  .superRefine((setting, ctx) => {
    const { key, value, pattern } = setting
    if (pattern && value !== '' && !new RegExp(pattern).test(value)) {
      ctx.addIssue({ code: 'custom', path: ['value'], message: `${key}: valeur invalide (${pattern})` })
    }
  })

const settingsSchema = z.array(settingSchema)

const settings: z.input<typeof settingsSchema> = [
  { category: SettingCategory.MAIL, key: 'MAIL_HOST', value: 'localhost' },
  { category: SettingCategory.MAIL, key: 'MAIL_PORT', value: '1025', pattern: PATTERN.PORT },
  { category: SettingCategory.MAIL, key: 'MAIL_SECURE', value: 'false', pattern: PATTERN.BOOL },
  { category: SettingCategory.MAIL, key: 'MAIL_USER', value: '', secret: true },
  { category: SettingCategory.MAIL, key: 'MAIL_PASSWORD', value: '', secret: true },
  { category: SettingCategory.MAIL, key: 'MAIL_FROM_NAME', value: 'UIX' },
  { category: SettingCategory.MAIL, key: 'MAIL_FROM_EMAIL', value: 'noreply@example.com', pattern: PATTERN.EMAIL },

  { category: SettingCategory.STORAGE, key: 'RUSTFS_ENDPOINT', value: 'localhost' },
  { category: SettingCategory.STORAGE, key: 'RUSTFS_ACCESS_KEY', value: 'uixadmin', secret: true },
  { category: SettingCategory.STORAGE, key: 'RUSTFS_SECRET_KEY', value: 'uixsecretkey', secret: true },
  { category: SettingCategory.STORAGE, key: 'RUSTFS_API_PORT', value: '9000', pattern: PATTERN.PORT },
  { category: SettingCategory.STORAGE, key: 'RUSTFS_USE_SSL', value: 'false', pattern: PATTERN.BOOL },
  { category: SettingCategory.STORAGE, key: 'RUSTFS_BUCKET', value: 'uix' },

  { category: SettingCategory.LLM, key: 'ANTHROPIC_API_KEY', value: '', secret: true },
  { category: SettingCategory.LLM, key: 'OPENAI_API_KEY', value: '', secret: true },

  { category: SettingCategory.VECTOR, key: 'QDRANT_HOST', value: 'localhost' },
  { category: SettingCategory.VECTOR, key: 'QDRANT_HTTP_PORT', value: '6333', pattern: PATTERN.PORT },
  { category: SettingCategory.VECTOR, key: 'QDRANT_GRPC_PORT', value: '6334', pattern: PATTERN.PORT },
]

const SUPERADMIN_NAME = 'Super Admin'

const superadminSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

async function seedSettings() {
  const validated = settingsSchema.parse(settings)

  for (const { category, key, value, secret, pattern } of validated) {
    const stored = secret && value ? encryptSecret(value) : value
    await prisma.appSetting.upsert({
      where: { key },
      update: { pattern: pattern ?? null },
      create: { category, key, value: stored, secret, pattern: pattern ?? null },
    })
  }
  console.log(`✅  Seed: ${validated.length} réglages garantis (app_setting).`)
}

async function seedSuperadmin() {
  const superadmin = superadminSchema.parse({
    email: process.env['SUPERADMIN_EMAIL'],
    password: process.env['SUPERADMIN_PASSWORD'],
  })

  const existing = await prisma.user.findUnique({ where: { email: superadmin.email } })
  if (existing) {
    console.log(`ℹ️   Seed: superadmin déjà présent (${superadmin.email}).`)
    return
  }

  const userId = randomUUID()
  const hashedPassword = await hashPassword(superadmin.password)
  await prisma.user.create({
    data: {
      id: userId,
      name: SUPERADMIN_NAME,
      email: superadmin.email,
      emailVerified: true,
      role: 'superadmin',
      accounts: {
        create: {
          id: randomUUID(),
          accountId: userId,
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })
  console.log(`✅  Seed: superadmin créé (${superadmin.email}) — changer le mot de passe à la 1re connexion.`)
}

async function main() {
  await seedSettings()
  await seedSuperadmin()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
