import { createAuthClient } from 'better-auth/react'
import { adminClient, emailOTPClient } from 'better-auth/client/plugins'
import { API_URL } from './api'

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [adminClient(), emailOTPClient()],
})

export const { useSession, signOut } = authClient

export const ADMIN_ROLES = ['admin', 'superadmin']

export function isAdmin(role?: string | string[] | null): boolean {
  if (!role) return false
  const roles = Array.isArray(role) ? role : role.split(',')
  return roles.some((r) => ADMIN_ROLES.includes(r.trim()))
}
