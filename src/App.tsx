import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Toaster } from '@blinkdotnew/ui'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { TeamPage } from './pages/TeamPage'
import { SettingsPage } from './pages/SettingsPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { useAuth } from './hooks/useAuth'
import { LoadingOverlay } from '@blinkdotnew/ui'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard-layout',
  component: () => {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
      if (!isLoading && !user) {
        navigate({ to: '/' })
      }
    }, [isLoading, user, navigate])

    if (isLoading) return <LoadingOverlay />
    if (!user) return null

    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    )
  },
})

const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const teamRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/team',
  component: TeamPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/settings',
  component: SettingsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardLayoutRoute.addChildren([dashboardRoute, teamRoute, settingsRoute]),
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
