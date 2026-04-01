import React from 'react'
import { 
  Button, 
  Container, 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody,
  Stack,
  StatGroup,
  Stat,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@blinkdotnew/ui'
import { 
  GitPullRequest, 
  Activity, 
  BarChart3, 
  Zap, 
  Users, 
  Lock 
} from 'lucide-react'
import { blink } from '../blink/client'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export function LandingPage() {
  const { user, isLoading, login } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, isLoading, navigate])

  const handleLogin = () => {
    login()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-[0.05] blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent opacity-[0.05] blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <nav className="h-20 border-b border-border/50 flex items-center px-6 md:px-12 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl">
            D
          </div>
          <span className="font-bold text-2xl tracking-tighter">DevPulse</span>
        </div>
        <div className="flex-1" />
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-border/50 hover:bg-secondary"
          onClick={handleLogin}
        >
          <GitPullRequest size={18} />
          <span>Sign In</span>
        </Button>
      </nav>

      <Page className="pt-20 md:pt-32">
        <PageHeader className="text-center max-w-4xl mx-auto px-6">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Zap size={14} className="fill-current" />
            <span>Powering top engineering teams</span>
          </div>
          <PageTitle className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            Engineering Metrics <br />
            <span className="text-primary">That Actually Matter</span>
          </PageTitle>
          <PageDescription className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            DevPulse integrates with GitHub to provide deep insights into your team's velocity, quality, and collaboration patterns.
          </PageDescription>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl w-full sm:w-auto" onClick={handleLogin}>
              <GitPullRequest size={20} className="mr-2" />
              Get Started with GitHub
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-8 text-lg font-bold rounded-xl w-full sm:w-auto">
              View Demo
            </Button>
          </div>
        </PageHeader>

        <PageBody className="mt-32 pb-32">
          <Container className="max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <Activity size={32} className="text-primary" />,
                  title: 'Cycle Time', 
                  desc: 'Measure the speed from first commit to production deployment.' 
                },
                { 
                  icon: <GitPullRequest size={32} className="text-accent" />,
                  title: 'Review Velocity', 
                  desc: 'Track how quickly pull requests are reviewed and merged.' 
                },
                { 
                  icon: <BarChart3 size={32} className="text-primary" />,
                  title: 'Predictable Delivery', 
                  desc: 'Identify bottlenecks and improve your team s delivery cadence.' 
                }
              ].map((item, i) => (
                <Card key={i} className="bg-secondary/50 border-border/50 hover:border-primary/50 transition-colors p-8 rounded-3xl">
                  <div className="mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {item.desc}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-32 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
              <Card className="bg-background/80 backdrop-blur-xl border-border/50 rounded-3xl overflow-hidden relative">
                <div className="p-8 md:p-12 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Ready to Pulse?</h2>
                    <p className="text-muted-foreground text-lg">Connect your GitHub organization and start tracking metrics in seconds.</p>
                  </div>
                  <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl" onClick={handleLogin}>
                    Start for Free
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border/50">
                   {[
                    { label: 'Setup Time', value: '< 2 min' },
                    { label: 'Repos Supported', value: '1000+' },
                    { label: 'Team Size', value: 'Unlimited' },
                    { label: 'Security', value: 'SOC 2 Ready' }
                  ].map((stat, i) => (
                    <div key={i} className="p-6 text-center border-r last:border-r-0 border-border/50">
                      <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-xl font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Container>
        </PageBody>
      </Page>

      <footer className="border-t border-border/50 py-12 px-6">
        <Container className="max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-black text-sm">
              D
            </div>
            <span className="font-bold text-lg tracking-tighter">DevPulse</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 DevPulse. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  )
}
