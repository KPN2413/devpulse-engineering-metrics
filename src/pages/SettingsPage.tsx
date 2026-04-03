import { useState, useEffect } from 'react'
import { Page, PageHeader, PageTitle, PageDescription, PageBody, Card, CardHeader, CardTitle, CardContent, Button, Input, Field, FieldLabel, FieldDescription, Banner, Badge, Tabs, TabsList, TabsTrigger, TabsContent, toast } from '@blinkdotnew/ui'
import { Settings, Shield, Bell, Github, Link as LinkIcon, Copy, CheckCircle2, AlertCircle } from 'lucide-react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'

export function SettingsPage() {
  const { user } = useAuth()
  const [webhookUrl, setWebhookUrl] = useState('')
  const [secret, setSecret] = useState('devpulse_wh_secret_****************')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Determine the webhook URL based on the project ID
    const projectId = import.meta.env.VITE_BLINK_PROJECT_ID || 'devpulse-dashboard-f6b05h7q'
    setWebhookUrl(`https://${projectId}.backend.blink.new/webhooks/github`)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Page className="p-8 animate-fade-in">
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageDescription>Manage your workspace configuration and repository integrations.</PageDescription>
      </PageHeader>

      <PageBody>
        <Tabs defaultValue="integrations" className="space-y-8">
          <TabsList className="glass border-border/50">
            <TabsTrigger value="integrations"><Github className="w-4 h-4 mr-2" /> Integrations</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" /> Security</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-8">
            {/* GitHub Webhook Setup */}
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Github className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>GitHub Webhook Setup</CardTitle>
                    <CardDescription>Connect your repository to DevPulse for real-time monitoring.</CardDescription>
                  </div>
                </div>
                <Badge variant="success" className="px-3 py-1">Active</Badge>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <Banner variant="info" className="border-primary/20 bg-primary/5">
                  Follow these steps in your GitHub repository settings to start collecting metrics.
                </Banner>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <FieldLabel>Webhook URL</FieldLabel>
                    <div className="flex gap-2">
                      <Input value={webhookUrl} readOnly className="font-mono text-sm bg-muted/50" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <FieldDescription>Use this as your Payload URL in GitHub.</FieldDescription>
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel>Secret Key</FieldLabel>
                    <div className="flex gap-2">
                      <Input value={secret} readOnly className="font-mono text-sm bg-muted/50" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard('devpulse_wh_secret_demo')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <FieldDescription>The secret used to sign webhook requests.</FieldDescription>
                  </div>
                </div>

                <div className="space-y-4 border-t border-border pt-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Event Subscriptions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { event: 'Pull Requests', desc: 'Required for cycle time and review speed.' },
                      { event: 'Pull Request Reviews', desc: 'Required for review turnaround metrics.' },
                      { event: 'Pushes', desc: 'Required for commit frequency tracking.' },
                      { event: 'Deployment Status', desc: 'Required for deployment frequency.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background/50">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-bold">{item.event}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Repositories */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Connected Repositories</CardTitle>
                <CardDescription>Manage the repositories connected to this workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'platform-api', status: 'connected', owner: 'devpulse' },
                  { name: 'frontend-core', status: 'not_connected', owner: 'devpulse' },
                ].map((repo, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Github className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{repo.owner}/{repo.name}</p>
                        <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {repo.status === 'connected' ? (
                        <Badge variant="success" className="px-2 py-0.5">Connected</Badge>
                      ) : (
                        <Button variant="outline" size="sm" className="text-xs font-bold">Connect Repo</Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full py-6 rounded-xl border-dashed hover:border-primary transition-colors">
                  <Github className="w-4 h-4 mr-2" /> Connect Another Repository
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="glass">
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Notification settings coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="glass">
              <CardHeader><CardTitle>Security & Access</CardTitle></CardHeader>
              <CardContent className="p-12 text-center">
                <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Security settings coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>
    </Page>
  )
}
