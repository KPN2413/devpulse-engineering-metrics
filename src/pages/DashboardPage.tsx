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
import { useAuth } from '../hooks/useAuth'
import { useRepos, useMetrics } from '../hooks/useMetrics'

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
  const { user } = useAuth()
  const { data: repos, isLoading: isLoadingRepos } = useRepos()
  const [selectedRepoId, setSelectedRepoId] = React.useState<string | null>(null)
  
  const { data: metrics, isLoading: isLoadingMetrics } = useMetrics(selectedRepoId)

  React.useEffect(() => {
    if (repos && repos.length > 0 && !selectedRepoId) {
      setSelectedRepoId(repos[0].id)
    }
  }, [repos, selectedRepoId])

  // Transform metrics for charts
  const chartData = React.useMemo(() => {
    if (!metrics) return []
    return metrics.map((m: any) => ({
      date: new Date(m.date).toLocaleDateString(),
      cycleTime: m.avgCycleTimeMs / (1000 * 60 * 60 * 24), // to days
      prs: m.prCount,
      commits: m.commitCount
    }))
  }, [metrics])

  const latestMetrics = chartData[chartData.length - 1] || { prs: 0, cycleTime: 0, commits: 0 }

  const metricsStats = [
    { label: 'Total PRs', value: latestMetrics.prs, trend: 0, trendLabel: 'today', icon: <GitPullRequest className="text-primary" /> },
    { label: 'Avg PR Cycle Time', value: `${latestMetrics.cycleTime.toFixed(1)} days`, trend: 0, trendLabel: 'today', icon: <Clock className="text-accent" /> },
    { label: 'Commit Count', value: latestMetrics.commits, trend: 0, trendLabel: 'today', icon: <Activity className="text-primary" /> },
    { label: 'Repos Connected', value: repos?.length || 0, trend: 0, trendLabel: 'total', icon: <CheckCircle2 className="text-accent" /> },
  ]

  if (isLoadingRepos) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <Page>
      <PageHeader className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageTitle className="text-3xl font-bold tracking-tight">Engineering Dashboard</PageTitle>
          <PageDescription className="text-muted-foreground text-lg leading-relaxed">
            Overview of {selectedRepoId ? 'repository' : 'your'} velocity and review metrics.
          </PageDescription>
        </div>
        
        {repos && repos.length > 0 && (
          <select 
            className="bg-secondary border border-border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            value={selectedRepoId || ''}
            onChange={(e) => setSelectedRepoId(e.target.value)}
          >
            {repos.map((repo: any) => (
              <option key={repo.id} value={repo.id}>{repo.owner}/{repo.name}</option>
            ))}
          </select>
        )}
      </PageHeader>

      <PageBody>
        <StatGroup className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsStats.map((stat, i) => (
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