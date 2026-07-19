import { Button, Heading, Hr, Section, Text } from '@react-email/components'
import { BaseEmail, s } from './base'

export type WelcomeEmailProps = {
  name: string
  verifyUrl: string
}

export default function WelcomeEmail({
  name = 'Jane Doe',
  verifyUrl = 'https://example.com/verify?token=preview',
}: Partial<WelcomeEmailProps> = {}) {
  return (
    <BaseEmail
      preview={`Bienvenue sur UIX, ${name} — confirmez votre adresse e-mail`}
    >
      <Heading style={s.heading}>Bienvenue, {name} 👋</Heading>
      <Text style={s.paragraph}>
        Votre compte a été créé avec succès. Il ne vous reste plus qu'une étape :
        confirmer votre adresse e-mail pour activer votre accès.
      </Text>

      <Section style={s.buttonSection}>
        <Button href={verifyUrl} style={s.button}>
          Confirmer mon adresse e-mail
        </Button>
      </Section>

      <Hr style={{ borderColor: '#f4f4f5', margin: '28px 0 0' }} />

      <Text style={{ ...s.hint, marginTop: '20px' }}>
        Ce lien est valable <strong>24 heures</strong>. Si vous n'avez pas créé de
        compte, vous pouvez ignorer cet e-mail en toute sécurité.
      </Text>
    </BaseEmail>
  )
}
