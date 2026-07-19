import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from '@app/i18n'
import { requestOtpSchema, verifyOtpSchema } from '../auth.validators'
import { requestSignInOtp, verifySignInOtp } from '../servers/auth.service'

type Step = 'email' | 'otp'

export function useLogin() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function requestCode(formData: FormData) {
    setError(null)
    const parsed = requestOtpSchema.safeParse({ email: formData.get('email') })
    if (!parsed.success) {
      setError(t('auth.invalidEmail'))
      return
    }

    setIsPending(true)
    try {
      await requestSignInOtp(parsed.data.email)
      setEmail(parsed.data.email)
      setStep('otp')
    } catch {
      setError(t('auth.errorSend'))
    } finally {
      setIsPending(false)
    }
  }

  async function verifyCode(otp: string) {
    setError(null)
    const parsed = verifyOtpSchema.safeParse({ email, otp })
    if (!parsed.success) {
      setError(t('auth.invalidCode'))
      return
    }

    setIsPending(true)
    try {
      await verifySignInOtp(email, otp)
      await navigate('/dashboard')
    } catch {
      setError(t('auth.errorVerify'))
    } finally {
      setIsPending(false)
    }
  }

  function changeEmail() {
    setStep('email')
    setError(null)
  }

  return { step, email, error, isPending, requestCode, verifyCode, changeEmail }
}
