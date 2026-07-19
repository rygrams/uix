import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  index('routes/root.tsx'),
  layout('layouts/auth-layout.tsx', [
    route('login', 'routes/auth/login.tsx'),
  ]),
  layout('layouts/dashboard-layout.tsx', [
    route('dashboard', 'routes/dashboard/index.tsx'),
    route('config', 'routes/config/index.tsx'),
  ]),
] satisfies RouteConfig
