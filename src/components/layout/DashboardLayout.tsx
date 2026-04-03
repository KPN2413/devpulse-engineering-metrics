import { AppShell, AppShellSidebar, AppShellMain, MobileSidebarTrigger, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarItem, Navbar, NavbarContent, UserMenu } from '@blinkdotnew/ui'
import { LayoutDashboard, Users, Settings, Activity } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <AppShell>
      <AppShellSidebar>
        <Sidebar>
          <SidebarHeader className="flex items-center gap-2 px-4 h-16 border-b border-border">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-bold tracking-tight text-xl">DevPulse</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Engineering</SidebarGroupLabel>
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                href="/dashboard"
                active={location.pathname === '/dashboard'}
              />
              <SidebarItem
                icon={<Users size={20} />}
                label="Team"
                href="/team"
                active={location.pathname === '/team'}
              />
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarItem
                icon={<Settings size={20} />}
                label="Settings"
                href="/settings"
                active={location.pathname === '/settings'}
              />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </AppShellSidebar>
      <AppShellMain>
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <MobileSidebarTrigger className="md:hidden" />
            <span className="md:hidden font-bold tracking-tight">DevPulse</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <UserMenu
                user={{
                  name: user.displayName || 'Developer',
                  email: user.email || '',
                  image: user.avatarUrl || `https://avatar.vercel.sh/${user.id}`,
                }}
              />
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </AppShellMain>
    </AppShell>
  )
}
