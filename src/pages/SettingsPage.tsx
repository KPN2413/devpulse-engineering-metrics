import React from 'react'
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Banner,
  Code,
  Divider,
  Stack,
  HStack
} from '@blinkdotnew/ui'
import { 
  Settings, 
  Webhook, 
  Bell, 
  Shield, 
  Copy, 
  Check, 
  Zap,
  LayoutDashboard
} from 'lucide-react'
import { toast } from '@blinkdotnew/ui'

export function SettingsPage() {
  const [copied, setCopied] = React.useState(false)
  const webhookUrl = `${window.location.origin}/webhooks/github`

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    toast.success('Webhook URL copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Page>
      <PageHeader className="mb-8">
        <PageTitle className="text-3xl font-bold tracking-tight">Settings</PageTitle>
        <PageDescription className="text-muted-foreground text-lg leading-relaxed">
          Manage your GitHub integration, team alerts, and security preferences.
        </PageDescription>
      </PageHeader>

      <PageBody>
        <Tabs defaultValue="github" className="space-y-10">
          <TabsList className="bg-secondary/30 border-border/50 p-1 rounded-xl h-12">
            <TabsTrigger value="github" className="px-6 rounded-lg font-bold data-[state=active]:bg-background">
              <Settings size={16} className="mr-2" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-6 rounded-lg font-bold data-[state=active]:bg-background">
              <Bell size={16} className="mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="px-6 rounded-lg font-bold data-[state=active]:bg-background">
              <Shield size={16} className="mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="github" className="space-y-10 outline-none">
            <Card className="bg-secondary/30 border-border/50 rounded-2xl overflow-hidden shadow-none">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Webhook size={20} className="text-primary" />
                  Webhook Configuration
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Configure GitHub webhooks to start receiving PR and commit data in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                <Banner 
                  variant="info" 
                  className="rounded-xl border-primary/20 bg-primary/5"
                  title="GitHub Permissions"
                >
                  Make sure to select "Pull Requests", "Pushes", and "Issue Comments" when creating your webhook.
                </Banner>

                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Webhook URL</label>
                  <div className="flex gap-2">
                    <Input 
                      readOnly 
                      value={webhookUrl} 
                      className="bg-background border-border/50 h-12 rounded-xl flex-1 font-mono text-sm"
                    />
                    <Button 
                      variant="secondary" 
                      className="h-12 px-6 rounded-xl font-bold flex items-center gap-2"
                      onClick={handleCopy}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 space-y-6">
                  <h4 className="font-bold text-lg">Step-by-step Setup</h4>
                  <ol className="space-y-6 text-muted-foreground">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground shrink-0 border border-border/50">1</div>
                      <p className="pt-1.5 leading-relaxed">Go to your <span className="text-foreground font-medium">GitHub Repository</span> and navigate to <span className="text-foreground font-medium">Settings → Webhooks</span>.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground shrink-0 border border-border/50">2</div>
                      <p className="pt-1.5 leading-relaxed">Click <span className="text-foreground font-medium">Add Webhook</span> and paste the Payload URL above.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground shrink-0 border border-border/50">3</div>
                      <p className="pt-1.5 leading-relaxed">Set Content type to <span className="text-foreground font-medium">application/json</span>.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground shrink-0 border border-border/50">4</div>
                      <p className="pt-1.5 leading-relaxed">Select <span className="text-foreground font-medium">Let me select individual events</span> and choose Pull requests, Pushes, and Pull request reviews.</p>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border/50 rounded-2xl overflow-hidden shadow-none">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
                  <Zap size={20} />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">Irreversible actions for your GitHub integration.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="flex items-center justify-between gap-8 p-6 bg-destructive/5 border border-destructive/20 rounded-2xl">
                  <div>
                    <h5 className="font-bold text-foreground mb-1">Disconnect GitHub</h5>
                    <p className="text-sm text-muted-foreground">Stop all data sync and remove your organization connection.</p>
                  </div>
                  <Button variant="destructive" className="font-bold rounded-xl h-11 px-6">Disconnect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>
    </Page>
  )
}
