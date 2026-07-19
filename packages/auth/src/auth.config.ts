import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, emailOTP } from 'better-auth/plugins'
import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access'
import type { PrismaClient } from '@app/database'

export type OtpType =
  | 'sign-in'
  | 'email-verification'
  | 'forget-password'
  | 'change-email'

// Access control — the admin plugin requires every `adminRoles` entry to be a
// declared role. `superadmin` is a custom role (seeded), so it must be defined
// here alongside the built-in `admin`/`user` roles.
const accessControl = createAccessControl({ ...defaultStatements })

const roles = {
  user: accessControl.newRole({}),
  admin: accessControl.newRole({ ...adminAc.statements }),
  superadmin: accessControl.newRole({ ...adminAc.statements }),
}

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
  sendOTP: (params: {
    email: string
    otp: string
    type: OtpType
  }) => Promise<void>
}

export function createAuth(prisma: PrismaClient, mailer: AuthMailer) {
  return betterAuth({
    appName: 'UIX',
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
    plugins: [
      admin({
        ac: accessControl,
        roles,
        defaultRole: 'user',
        adminRoles: ['admin', 'superadmin'],
      }),
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        // Admin sign-in is email + OTP only; do not create accounts on the fly.
        disableSignUp: true,
        sendVerificationOTP: async ({ email, otp, type }) => {
          await mailer.sendOTP({ email, otp, type })
        },
      }),
    ],
  })
}

export type Auth = ReturnType<typeof createAuth>
export type Session = Auth['$Infer']['Session']
export type User = Session['user']
