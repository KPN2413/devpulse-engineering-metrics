import { 
  createRouter, 
  createRoute, 
  createRootRoute, 
  RouterProvider, 
  Outlet, 
} from '@tanstack/react-router'
import { Toaster } from '@blinkdotnew/ui'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { TeamPage } from './pages/TeamPage'
import { SettingsPage } from './pages/SettingsPage'
import { DashboardLayout } from './layouts/DashboardLayout'

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  ),
})

// Public Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

// Protected Routes (Nested under DashboardLayout)
const dashboardRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard-root',
  component: DashboardLayout,
})

const dashboardRoute = createRoute({
  getParentRoute: () => dashboardRootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const teamRoute = createRoute({
  getParentRoute: () => dashboardRootRoute,
  path: '/team',
  component: TeamPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => dashboardRootRoute,
  path: '/settings',
  component: SettingsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRootRoute.addChildren([
    dashboardRoute,
    teamRoute,
    settingsRoute,
  ]),
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
