import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import type { PrismaClient } from '@app/database'

const DEFAULT_TRUSTED_ORIGINS = ['http://localhost:3000', 'http://localhost:3001']

function getTrustedOrigins(): string[] {
  const configuredOrigins = process.env['BETTER_AUTH_TRUSTED_ORIGINS']
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (configuredOrigins?.length) {
    return configuredOrigins
  }

  return process.env['NODE_ENV'] === 'production' ? [] : DEFAULT_TRUSTED_ORIGINS
}

// Minimal interface — implemented in the API bridge, not here.
// Keeps packages/auth free of email rendering and transport concerns.
export type AuthMailer = {
  sendVerificationEmail: (params: {
    email: string
    name: string
    url: string
  }) => Promise<void>
  sendResetPassword: (params: {
    email: string
    name: string
    url: string
  }) => Promise<void>
}

export function createAuth(prisma: PrismaClient, mailer: AuthMailer) {
  return betterAuth({
    appName: 'Prod Dev Boilerplate',
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    secret: process.env['BETTER_AUTH_SECRET'],
    baseURL: process.env['BETTER_AUTH_URL'],
    trustedOrigins: getTrustedOrigins(),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      requireEmailVerification: true,
      sendVerificationEmail: async ({
        user,
        url,
      }: {
        user: { email: string; name: string }
        url: string
      }) => {
        await mailer.sendVerificationEmail({
          email: user.email,
          name: user.name,
          url,
        })
      },
      sendResetPassword: async ({
        user,
        url,
      }: {
        user: { email: string; name: string }
        url: string
      }) => {
        await mailer.sendResetPassword({ email: user.email, name: user.name, url })
      },
    },
    user: {
      additionalFields: {},
    },
    plugins: [],
  })
}

export type Auth = ReturnType<typeof createAuth>
export type Session = Auth['$Infer']['Session']
export type User = Session['user']
