import { authClient, signOut } from '../../../lib/auth-client'

export async function requestSignInOtp(email: string) {
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: 'sign-in',
  })
  if (error) {
    throw new Error(error.message ?? "Impossible d'envoyer le code")
  }
}

export async function verifySignInOtp(email: string, otp: string) {
  const { error } = await authClient.signIn.emailOtp({ email, otp })
  if (error) {
    throw new Error(error.message ?? 'Code invalide ou expiré')
  }
}

export async function signOutUser() {
  await signOut()
}
