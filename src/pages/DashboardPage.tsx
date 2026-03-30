import React from 'react'
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody,
  StatGroup,
  Stat,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  AreaChart,
  BarChart,
  DataTable,
  Persona,
  Badge,
  EmptyState
} from '@blinkdotnew/ui'
import { 
  GitPullRequest, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

// Placeholder data
const metricsData = [
  { label: 'Total PRs', value: '1,284', trend: 12.5, trendLabel: 'vs last month', icon: <GitPullRequest className="text-primary" /> },
  { label: 'Avg PR Cycle Time', value: '2.4 days', trend: -8.3, trendLabel: 'vs last month', icon: <Clock className="text-accent" /> },
  { label: 'Commit Frequency', value: '45.2/day', trend: 4.2, trendLabel: 'vs last month', icon: <Activity className="text-primary" /> },
  { label: 'Review Turnaround', value: '4.8 hours', trend: -12.4, trendLabel: 'vs last month', icon: <CheckCircle2 className="text-accent" /> },
]

const chartData = [
  { date: '2024-01-01', cycleTime: 3.2, prs: 120 },
  { date: '2024-01-08', cycleTime: 2.8, prs: 145 },
  { date: '2024-01-15', cycleTime: 3.5, prs: 110 },
  { date: '2024-01-22', cycleTime: 2.4, prs: 160 },
  { date: '2024-01-29', cycleTime: 2.1, prs: 185 },
  { date: '2024-02-05', cycleTime: 2.3, prs: 170 },
  { date: '2024-02-12', cycleTime: 1.9, prs: 205 },
]

const recentPRs = [
  { id: '1', title: 'feat: add metrics dashboard', author: 'Kai Chen', status: 'merged', time: '2h ago' },
  { id: '2', title: 'fix: database connection leak', author: 'Sarah Smith', status: 'open', time: '4h ago' },
  { id: '3', title: 'docs: update webhook setup', author: 'Mike Ross', status: 'closed', time: '1d ago' },
  { id: '4', title: 'refactor: use hono for edge functions', author: 'Kai Chen', status: 'merged', time: '2d ago' },
]

export function DashboardPage() {
  return (
    <Page>
      <PageHeader className="mb-8">
        <PageTitle className="text-3xl font-bold tracking-tight">Engineering Dashboard</PageTitle>
        <PageDescription className="text-muted-foreground text-lg leading-relaxed">
          Overview of your team s velocity and review metrics for the last 30 days.
        </PageDescription>
      </PageHeader>

      <PageBody>
        <StatGroup className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsData.map((stat, i) => (
            <Stat 
              key={i}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendLabel={stat.trendLabel}
              icon={stat.icon}
              className="bg-secondary/30 border-border/50 rounded-2xl p-6"
            />
          ))}
        </StatGroup>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <Card className="lg:col-span-2 bg-secondary/30 border-border/50 rounded-2xl overflow-hidden shadow-none">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold">Velocity Trends</CardTitle>
              <CardDescription className="text-muted-foreground">Cycle time and PR volume over time</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <AreaChart 
                data={chartData} 
                dataKey="cycleTime" 
                xAxisKey="date" 
                height={300}
                className="text-primary"
              />
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-border/50 rounded-2xl overflow-hidden shadow-none">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold">Recent Pull Requests</CardTitle>
              <CardDescription className="text-muted-foreground">Latest activity from your team</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {recentPRs.map((pr) => (
                  <div key={pr.id} className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate mb-1 leading-tight">{pr.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Persona name={pr.author} className="h-4 w-4" />
                        <span>•</span>
                        <span>{pr.time}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={pr.status === 'merged' ? 'secondary' : pr.status === 'open' ? 'default' : 'outline'}
                      className="rounded-full text-[10px] h-5 px-2 font-bold uppercase tracking-wider"
                    >
                      {pr.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-secondary/30 border-border/50 rounded-2xl overflow-hidden shadow-none">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-bold">Metric Insights</CardTitle>
            <CardDescription className="text-muted-foreground">Deep dive into key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
             <BarChart 
                data={chartData} 
                dataKey="prs" 
                xAxisKey="date" 
                height={300}
                className="text-accent"
              />
          </CardContent>
        </Card>
      </PageBody>
    </Page>
  )
}
