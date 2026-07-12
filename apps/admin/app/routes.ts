import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  index('routes/root.tsx'),
  layout('layouts/auth-layout.tsx', [
    route('login', 'routes/auth/login.tsx'),
    route('register', 'routes/auth/register.tsx'),
    route('forgot-password', 'routes/auth/forgot-password.tsx'),
  ]),
  layout('layouts/dashboard-layout.tsx', [
    route('dashboard', 'routes/dashboard/index.tsx'),
  ]),
] satisfies RouteConfig
