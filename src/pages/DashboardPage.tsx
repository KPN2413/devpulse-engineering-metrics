import { useState, useEffect } from 'react'
import { Page, PageHeader, PageTitle, PageDescription, PageActions, PageBody, StatGroup, Stat, Card, CardHeader, CardTitle, CardContent, DataTable, AreaChart, BarChart, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Skeleton, Badge, Persona } from '@blinkdotnew/ui'
import { Calendar, Filter, RefreshCcw, Download, GitPullRequest, Clock, Zap, MessageSquare, Rocket } from 'lucide-react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import { seedDemoData } from '../lib/seed'
import { format, subDays, startOfDay } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'

export function DashboardPage() {
  const { user } = useAuth()
  const [repos, setRepos] = useState<any[]>([])
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const [metrics, setMetrics] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [recentPrs, setRecentPrs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const init = async () => {
        setIsLoading(true)
        await seedDemoData(user.id)
        
        // Fetch data
        const repoList = await blink.db.repositories.list({ where: { userId: user.id } })
        setRepos(repoList)
        if (repoList.length > 0) {
          const firstRepo = repoList[0].id
          setSelectedRepo(firstRepo)
          await loadRepoData(firstRepo, user.id)
        }
        setIsLoading(false)
      }
      init()
    }
  }, [user])

  const loadRepoData = async (repoId: string, userId: string) => {
    // Recent PRs
    const prs = await blink.db.pullRequests.list({
      where: { repoId, userId },
      limit: 10,
      orderBy: { createdAtGithub: 'desc' }
    })
    setRecentPrs(prs)

    // Trends (Metric Snapshots)
    const snapshots = await blink.db.metricSnapshots.list({
      where: { repoId, userId },
      limit: 14,
      orderBy: { date: 'asc' }
    })
    setTrends(snapshots.map(s => ({
      date: format(new Date(s.date), 'MMM dd'),
      prs: s.totalPrs,
      cycleTime: s.avgCycleTimeHours,
      commits: s.commitCount,
      turnaround: s.avgReviewTurnaroundHours,
      deploys: s.deploymentCount
    })))

    // Summary Metrics
    const totalPrs = prs.length
    const mergedPrs = prs.filter(p => p.state === 'merged')
    const avgCycleTime = mergedPrs.reduce((acc, p) => acc + (p.cycleTimeMinutes || 0), 0) / (mergedPrs.length || 1)
    
    const commits = await blink.db.commits.count({ where: { repoId, userId } })
    const deploys = await blink.db.deployments.count({ where: { repoId, userId } })

    setMetrics({
      totalPrs,
      avgCycleTime: (avgCycleTime / 60).toFixed(1),
      commitFreq: (commits / 30).toFixed(1),
      reviewTurnaround: (Math.random() * 4 + 2).toFixed(1), // Mocked for demo
      deployFreq: (deploys / 15).toFixed(1)
    })
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'number',
      header: '#',
      cell: ({ row }) => <span className="font-mono text-muted-foreground">#{row.original.number}</span>,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 max-w-[400px]">
          <span className="font-bold truncate">{row.original.title}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(row.original.createdAtGithub), 'MMM dd, yyyy')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'state',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.state === 'merged'
              ? 'success'
              : row.original.state === 'closed'
              ? 'destructive'
              : 'default'
          }
          className="capitalize"
        >
          {row.original.state}
        </Badge>
      ),
    },
    {
      accessorKey: 'cycleTimeMinutes',
      header: 'Cycle Time',
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.cycleTimeMinutes ? `${(row.original.cycleTimeMinutes / 60).toFixed(1)}h` : '--'}
        </span>
      ),
    },
  ]

  if (isLoading) {
    return (
      <Page className="p-8">
        <PageHeader>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </PageHeader>
        <PageBody className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
          </div>
        </PageBody>
      </Page>
    )
  }

  return (
    <Page className="p-8 animate-fade-in">
      <PageHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <PageTitle>Engineering Dashboard</PageTitle>
            <PageDescription>Track velocity, quality, and throughput for your repositories.</PageDescription>
          </div>
          <PageActions className="flex items-center gap-3">
            <Select value={selectedRepo} onValueChange={(val) => {
              setSelectedRepo(val)
              if (user) loadRepoData(val, user.id)
            }}>
              <SelectTrigger className="w-[240px] bg-background">
                <SelectValue placeholder="Select repository" />
              </SelectTrigger>
              <SelectContent>
                {repos.map(repo => (
                  <SelectItem key={repo.id} value={repo.id}>{repo.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon"><RefreshCcw className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><Calendar className="w-4 h-4" /></Button>
          </PageActions>
        </div>
      </PageHeader>

      <PageBody className="space-y-8">
        {/* Top Metrics */}
        <StatGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            label="Total Pull Requests"
            value={metrics?.totalPrs || 0}
            trend={15}
            trendLabel="vs last month"
            icon={<GitPullRequest className="text-primary" size={20} />}
            className="glass"
          />
          <Stat
            label="Avg Cycle Time"
            value={`${metrics?.avgCycleTime || 0}h`}
            trend={-8}
            trendLabel="lower is better"
            icon={<Clock className="text-primary" size={20} />}
            className="glass"
          />
          <Stat
            label="Commits / Day"
            value={metrics?.commitFreq || 0}
            trend={22}
            trendLabel="increased activity"
            icon={<Zap className="text-primary" size={20} />}
            className="glass"
          />
          <Stat
            label="Review Turnaround"
            value={`${metrics?.reviewTurnaround || 0}h`}
            trend={-12}
            trendLabel="faster reviews"
            icon={<MessageSquare className="text-primary" size={20} />}
            className="glass"
          />
        </StatGroup>

        {/* Deployment Frequency (Secondary Stat) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Deployment Frequency</CardTitle>
              <Rocket className="text-muted-foreground w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.deployFreq || 0} / day</div>
              <p className="text-xs text-muted-foreground mt-1">+5% from last week</p>
              <div className="mt-6">
                <BarChart
                  data={trends.slice(-7)}
                  dataKey="deploys"
                  xAxisKey="date"
                  height={120}
                  className="mt-4"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 glass">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Delivery Velocity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={trends}
                dataKey={['prs', 'cycleTime']}
                xAxisKey="date"
                height={220}
                showLegend
              />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: PRs Table & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Pull Requests</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={recentPrs}
                pageSize={5}
                className="border-none"
              />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Contributor Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={trends.slice(-10)}
                dataKey="commits"
                xAxisKey="date"
                height={200}
              />
              <div className="mt-6 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Contributors</h4>
                {[
                  { name: "Sarah Chen", commits: 45, prs: 12 },
                  { name: "Alex Rivera", commits: 38, prs: 8 },
                  { name: "Jordan Smith", commits: 32, prs: 9 },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <Persona name={c.name} subtitle={`${c.commits} commits`} />
                    <div className="text-xs font-bold bg-muted px-2 py-1 rounded group-hover:bg-primary group-hover:text-white transition-colors">
                      {c.prs} PRs
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </Page>
  )
}
