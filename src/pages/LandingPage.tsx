import { Button, Container, Card, CardContent } from '@blinkdotnew/ui'
import { Activity, Github, Rocket, Zap, BarChart3, Users as UsersIcon } from 'lucide-react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export function LandingPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, navigate])

  const handleLogin = async () => {
    // Use absolute URL to avoid potential "Invalid URL" errors in the SDK
    await blink.auth.login(window.location.origin + '/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-20 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold tracking-tighter">DevPulse</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm font-medium">Documentation</Button>
          <Button onClick={handleLogin} className="rounded-full px-6">Sign In</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-background -z-10" />
          <Container className="max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Empowering Engineering Teams
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              Engineering Metrics <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
              Transform your GitHub activity into actionable delivery insights. Measure PR cycle time, review speed, and contributor performance with zero config.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={handleLogin} size="lg" className="rounded-full px-10 py-7 text-lg font-bold">
                <Github className="w-6 h-6 mr-2" /> Connect GitHub
              </Button>
              <Button onClick={handleLogin} variant="outline" size="lg" className="rounded-full px-10 py-7 text-lg font-bold">
                View Demo
              </Button>
            </div>
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />
              <img
                src="https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=2070&auto=format&fit=crop"
                alt="DevPulse Dashboard Preview"
                className="rounded-2xl border border-border shadow-2xl scale-105 hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              />
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-muted/20">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tighter mb-4">Core Metrics for High-Speed Teams</h2>
              <p className="text-lg text-muted-foreground">Everything you need to ship better, faster, and more consistently.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Cycle Time", desc: "Measure the speed of your delivery pipeline from commit to deploy." },
                { icon: BarChart3, title: "Review Speed", desc: "Identify bottlenecks in your code review process and improve throughput." },
                { icon: UsersIcon, title: "Team Insights", desc: "Understand individual and team contributions with role-aware metrics." },
                { icon: Rocket, title: "Deployment Frequency", desc: "Track how often you're shipping value to your customers." },
                { icon: Activity, title: "Health Checks", desc: "Real-time monitoring of your repository's pulse and activity trends." },
                { icon: Github, title: "Webhook Ready", desc: "Seamless integration with GitHub webhooks for real-time dashboard updates." },
              ].map((feature, i) => (
                <Card key={i} className="group hover:border-primary/50 transition-colors border-border/50 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <Container className="max-w-4xl">
            <div className="rounded-3xl bg-primary p-12 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -z-0 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-5xl font-black tracking-tighter mb-6 leading-none">Ready to Accelerate Your <br /> Delivery?</h2>
                <p className="text-xl opacity-90 mb-10 font-medium max-w-xl mx-auto">
                  Join hundreds of software teams using DevPulse to build a better engineering culture.
                </p>
                <Button onClick={handleLogin} size="lg" variant="secondary" className="rounded-full px-12 py-7 text-xl font-bold hover:scale-105 transition-transform">
                  Start Monitoring Now
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <footer className="py-12 border-t border-border px-6 bg-background">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-70">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-bold tracking-tighter">DevPulse</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 DevPulse Metrics. Built with Blink SDK.</p>
        </Container>
      </footer>
    </div>
  )
}
