import { z } from 'zod'

/**
 * Generic, cross-cutting validators shared between the client (React forms) and
 * the server (React Router actions / NestJS use-cases). Feature-specific schemas
 * live in their own `*.validators.ts` file within this package.
 */

export const emailSchema = z.email().trim().toLowerCase()
export type Email = z.infer<typeof emailSchema>

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
export type Password = z.infer<typeof passwordSchema>

export const nonEmptyStringSchema = z.string().trim().min(1)
export type NonEmptyString = z.infer<typeof nonEmptyStringSchema>

export const uuidSchema = z.uuid()
export type Uuid = z.infer<typeof uuidSchema>
