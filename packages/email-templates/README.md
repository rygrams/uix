# @app/email-templates

Email templates built with [React Email](https://react.email). The package renders templates to HTML + plaintext — the API imports it to send emails.

## Usage

```ts
import { renderEmail, WelcomeEmail, ResetPasswordEmail } from '@app/email-templates'

// Welcome / verify email
const { html, text } = await renderEmail(WelcomeEmail, {
  name: 'Jane',
  verifyUrl: 'https://example.com/verify?token=abc',
})

// Password reset
const { html, text } = await renderEmail(ResetPasswordEmail, {
  name: 'Jane',
  resetUrl: 'https://example.com/reset?token=xyz',
})

// Pass html + text to your mailer (nodemailer, Resend, Brevo…)
```

## Preview

Starts a local dev server with live rendering — no email sent.

```bash
pnpm --filter @app/email-templates preview
# → http://localhost:3002
```

## Structure

```
src/
  templates/
    base.tsx            # Shared layout (header, footer, styles)
    welcome.tsx         # Account creation / email verification
    reset-password.tsx  # Password reset link
  render.ts             # renderEmail<P>(Template, props) → { html, text }
  index.ts              # Public exports
```

## Adding a template

1. Create `src/templates/my-template.tsx` — use `<BaseEmail preview="...">` as the wrapper:

```tsx
import { Button, Heading, Text } from '@react-email/components'
import { BaseEmail } from './base'

export type MyTemplateProps = { name: string; actionUrl: string }

export function MyTemplate({ name, actionUrl }: MyTemplateProps) {
  return (
    <BaseEmail preview={`Hello ${name}`}>
      <Heading>Hello, {name}</Heading>
      <Text>Click below to continue.</Text>
      <Button href={actionUrl}>Continue</Button>
    </BaseEmail>
  )
}
```

2. Export from `src/index.ts`:

```ts
export { MyTemplate } from './templates/my-template'
export type { MyTemplateProps } from './templates/my-template'
```

3. Rebuild: `pnpm --filter @app/email-templates build`

## Build

```bash
pnpm --filter @app/email-templates build
```

Output goes to `dist/` (CommonJS + type declarations). The API imports the built output.
