import { Button, Heading, Hr, Section, Text } from '@react-email/components'
import { BaseEmail, s } from './base'

export type ResetPasswordEmailProps = {
  name: string
  resetUrl: string
}

export default function ResetPasswordEmail({
  name = 'Jane Doe',
  resetUrl = 'https://example.com/reset?token=preview',
}: Partial<ResetPasswordEmailProps> = {}) {
  return (
    <BaseEmail preview="Réinitialisation de votre mot de passe UIX">
      <Heading style={s.heading}>Réinitialisation du mot de passe</Heading>
      <Text style={s.paragraph}>Bonjour {name},</Text>
      <Text style={{ ...s.paragraph, marginTop: '-12px' }}>
        Nous avons reçu une demande de réinitialisation du mot de passe associé à
        votre compte. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de
        passe.
      </Text>

      <Section style={s.buttonSection}>
        <Button href={resetUrl} style={s.button}>
          Réinitialiser mon mot de passe
        </Button>
      </Section>

      <Hr style={{ borderColor: '#f4f4f5', margin: '28px 0 0' }} />

      <Text style={{ ...s.hint, marginTop: '20px' }}>
        Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas demandé de
        réinitialisation, votre mot de passe reste inchangé — vous pouvez ignorer cet
        e-mail.
      </Text>
    </BaseEmail>
  )
}
