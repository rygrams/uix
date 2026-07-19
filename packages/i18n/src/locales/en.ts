import type { Translations } from '../types'

export const en: Translations = {
  common: {
    appName: 'UIX',
    retry: 'Retry',
    save: 'Save',
  },
  meta: {
    login: 'Sign in — UIX Admin',
    dashboard: 'Dashboard — UIX Admin',
    config: 'Configuration — UIX Admin',
  },
  authLayout: {
    tagline: 'The UIX admin space.',
    taglineDesc:
      'Manage the platform configuration, integrations and governance from a single place.',
    copyright: '© {year} UIX. All rights reserved.',
  },
  auth: {
    welcomeBack: 'Welcome back',
    emailPrompt: 'Enter your email to receive a sign-in code',
    codeSentTo: 'Code sent to {email}',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    requestCode: 'Send the code',
    signIn: 'Sign in',
    changeEmail: 'Change email address',
    invalidEmail: 'Invalid email address',
    invalidCode: 'The code must be 6 digits',
    errorSend: 'Could not send the code',
    errorVerify: 'Invalid or expired code',
    errorGeneric: 'Something went wrong',
  },
  nav: {
    dashboard: 'Dashboard',
    configuration: 'Configuration',
    admin: 'Administration',
    defaultUser: 'Administrator',
    signOut: 'Sign out',
    toggleTheme: 'Toggle theme',
    switchLanguage: 'Change language',
  },
  forbidden: {
    title: 'Access denied',
    description: 'Your account does not have administration rights.',
  },
  errors: {
    oops: 'Oops!',
    unexpected: 'An unexpected error occurred.',
    notFoundTitle: 'Page not found',
    notFoundDesc: 'The requested page could not be found.',
    errorTitle: 'Error',
  },
  config: {
    title: 'Configuration',
    subtitle: 'Application settings stored in the database and encrypted at rest.',
    loadError: 'Unable to load',
    saved: 'Configuration saved.',
    saveError: 'Unable to save',
    encryptionNote: 'Values encrypted at rest and decrypted on read by the API.',
    secretSet: '•••••••• (set — leave empty to keep)',
    secretUnset: 'Not set',
    categories: {
      MAIL: 'Mail (SMTP)',
      STORAGE: 'Storage (S3 / RustFS)',
      LLM: 'LLM models',
      VECTOR: 'Vector database (Qdrant)',
    },
  },
}
