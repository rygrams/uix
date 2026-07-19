import { useState } from 'react'
import {
  Alert,
  Button,
  Form,
  InputOTP,
  Label,
  Spinner,
  TextField,
} from '@heroui/react'
import { useTranslation } from '@app/i18n'
import { useLogin } from '../hooks/use-login'
import { Logo } from '../../../components/logo'
import { OutlineInput } from '../../../shared/components/outline-input'
import { ActionButton } from '../../../shared/components/action-button'

export function LoginForm() {
  const { t } = useTranslation()
  const { step, email, error, isPending, requestCode, verifyCode, changeEmail } =
    useLogin()
  const [otp, setOtp] = useState('')

  function onSubmitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void requestCode(new FormData(event.currentTarget))
  }

  function onSubmitOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void verifyCode(otp)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo className="size-12 rounded-2xl" />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('auth.welcomeBack')}
          </h1>
          <p className="text-sm text-muted">
            {step === 'email'
              ? t('auth.emailPrompt')
              : t('auth.codeSentTo', { email })}
          </p>
        </div>
      </div>

      {error ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      {step === 'email' ? (
        <Form className="flex flex-col gap-4" onSubmit={onSubmitEmail}>
          <TextField isRequired name="email" type="email">
            <Label>{t('auth.emailLabel')}</Label>
            <OutlineInput
              placeholder={t('auth.emailPlaceholder')}
              autoComplete="email"
              autoFocus
            />
          </TextField>

          <ActionButton
            type="submit"
            size="lg"
            isPending={isPending}
            className="w-full"
          >
            {isPending ? <Spinner color="current" size="sm" /> : null}
            {t('auth.requestCode')}
          </ActionButton>
        </Form>
      ) : (
        <Form className="flex flex-col items-center gap-5" onSubmit={onSubmitOtp}>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={(value) => void verifyCode(value)}
          >
            <InputOTP.Group>
              <InputOTP.Slot index={0} />
              <InputOTP.Slot index={1} />
              <InputOTP.Slot index={2} />
            </InputOTP.Group>
            <InputOTP.Separator />
            <InputOTP.Group>
              <InputOTP.Slot index={3} />
              <InputOTP.Slot index={4} />
              <InputOTP.Slot index={5} />
            </InputOTP.Group>
          </InputOTP>

          <ActionButton
            type="submit"
            size="lg"
            isPending={isPending}
            isDisabled={otp.length !== 6}
            className="w-full"
          >
            {isPending ? <Spinner color="current" size="sm" /> : null}
            {t('auth.signIn')}
          </ActionButton>

          <Button variant="ghost" size="sm" onPress={changeEmail}>
            {t('auth.changeEmail')}
          </Button>
        </Form>
      )}
    </div>
  )
}
