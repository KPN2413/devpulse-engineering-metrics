import React from 'react'
import { 
  AppShell, 
  AppShellSidebar, 
  AppShellMain, 
  MobileSidebarTrigger, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarItem, 
  Navbar, 
  NavbarBrand, 
  NavbarContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button
} from '@blinkdotnew/ui'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  GitBranch,
  ChevronDown
} from 'lucide-react'
import { Outlet, useNavigate, Link } from '@tanstack/react-router'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'

export function DashboardLayout() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    navigate({ to: '/' })
    return null
  }

  return (
    <AppShell>
      <AppShellSidebar>
        <Sidebar>
          <SidebarHeader className="flex items-center gap-2 p-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              DP
            </div>
            <span className="font-semibold text-xl tracking-tight">DevPulse</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Engineering</SidebarGroupLabel>
              <SidebarItem 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                href="/dashboard" 
              />
              <SidebarItem 
                icon={<Users size={20} />} 
                label="Team" 
                href="/team" 
              />
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Configuration</SidebarGroupLabel>
              <SidebarItem 
                icon={<Settings size={20} />} 
                label="Settings" 
                href="/settings" 
              />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </AppShellSidebar>
      <AppShellMain>
        <Navbar className="px-4 border-b">
          <NavbarBrand className="md:hidden flex items-center gap-2">
            <MobileSidebarTrigger />
            <span className="font-bold">DevPulse</span>
          </NavbarBrand>
          <NavbarContent className="flex-1 hidden md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <GitBranch size={18} />
                  <span>all-repositories</span>
                  <ChevronDown size={14} className="opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>devpulse-frontend</DropdownMenuItem>
                <DropdownMenuItem>devpulse-backend</DropdownMenuItem>
                <DropdownMenuItem>devpulse-shared</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavbarContent>
          <NavbarContent className="justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-9 w-9 rounded-full overflow-hidden">
                  <Avatar>
                    <AvatarImage src={user.display_name ? `https://avatar.vercel.sh/${user.display_name}` : undefined} />
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-muted-foreground text-xs">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => blink.auth.logout()}>
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavbarContent>
        </Navbar>
        <main className="p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </AppShellMain>
    </AppShell>
  )
}
