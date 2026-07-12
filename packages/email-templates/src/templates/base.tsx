import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components'
import type { ReactNode } from 'react'

type BaseEmailProps = {
  preview: string
  children: ReactNode
}

export function BaseEmail({ preview, children }: BaseEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          {/* Header */}
          <Section style={s.header}>
            <Text style={s.logo}>⬡ Boilerplate</Text>
          </Section>

          {/* Content */}
          <Section style={s.content}>{children}</Section>

          {/* Footer */}
          <Hr style={s.hr} />
          <Section>
            <Text style={s.footerText}>
              © {new Date().getFullYear()} Boilerplate. Tous droits réservés.
            </Text>
            <Row>
              <Column align="center">
                <Link href="#" style={s.footerLink}>
                  Politique de confidentialité
                </Link>
                <Text style={s.footerDot}> · </Text>
                <Link href="#" style={s.footerLink}>
                  Conditions d'utilisation
                </Link>
                <Text style={s.footerDot}> · </Text>
                <Link href="#" style={s.footerLink}>
                  Se désabonner
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const s = {
  body: {
    backgroundColor: '#fafafa',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    margin: '0',
    padding: '0',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '32px auto',
    maxWidth: '520px',
    borderRadius: '12px',
    border: '1px solid #e4e4e7',
    overflow: 'hidden' as const,
  },
  header: {
    backgroundColor: '#09090b',
    padding: '24px 40px',
  },
  logo: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
    letterSpacing: '-0.3px',
  },
  content: {
    padding: '40px 40px 32px',
  },
  hr: {
    borderColor: '#f4f4f5',
    margin: '0 40px',
  },
  footerText: {
    fontSize: '12px',
    color: '#a1a1aa',
    textAlign: 'center' as const,
    margin: '20px 0 4px',
  },
  footerLink: {
    fontSize: '12px',
    color: '#a1a1aa',
    textDecoration: 'underline',
  },
  footerDot: {
    display: 'inline',
    fontSize: '12px',
    color: '#d4d4d8',
    margin: '0 4px',
  },
  // Shared content styles reused in templates
  heading: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#09090b',
    margin: '0 0 12px',
    letterSpacing: '-0.4px',
    lineHeight: '1.3',
  },
  paragraph: {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#52525b',
    margin: '0 0 24px',
  },
  hint: {
    fontSize: '13px',
    lineHeight: '20px',
    color: '#a1a1aa',
    margin: '20px 0 0',
  },
  button: {
    backgroundColor: '#09090b',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    padding: '13px 28px',
    textDecoration: 'none',
    display: 'inline-block' as const,
  },
  buttonSection: {
    textAlign: 'center' as const,
    margin: '28px 0 0',
  },
}
