import { useState, useEffect } from 'react'
import { Page, PageHeader, PageTitle, PageDescription, PageBody, Card, CardHeader, CardTitle, CardContent, DataTable, Persona, Badge, Button, Input, Skeleton } from '@blinkdotnew/ui'
import { Users, Search, Filter, GitPullRequest, GitCommit, Clock, MessageSquare } from 'lucide-react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import type { ColumnDef } from '@tanstack/react-table'

export function TeamPage() {
  const { user } = useAuth()
  const [team, setTeam] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user) {
      const loadTeam = async () => {
        setIsLoading(true)
        const members = await blink.db.users.list({ where: { userId: user.id } })
        
        // Enrich with mock metrics for demo
        const enriched = members.map(m => ({
          ...m,
          commits: Math.floor(Math.random() * 50) + 10,
          prsOpened: Math.floor(Math.random() * 15) + 5,
          prsReviewed: Math.floor(Math.random() * 20) + 5,
          avgCycleTime: (Math.random() * 24 + 12).toFixed(1),
          avgTurnaround: (Math.random() * 8 + 2).toFixed(1),
        }))
        
        setTeam(enriched)
        setIsLoading(false)
      }
      loadTeam()
    }
  }, [user])

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Member',
      cell: ({ row }) => (
        <Persona 
          name={row.original.name} 
          subtitle={row.original.role} 
          src={row.original.avatarUrl} 
        />
      ),
    },
    {
      accessorKey: 'commits',
      header: () => (
        <div className="flex items-center gap-1">
          <GitCommit className="w-4 h-4" /> Commits
        </div>
      ),
      cell: ({ row }) => <span className="font-mono font-bold">{row.original.commits}</span>,
    },
    {
      accessorKey: 'prsOpened',
      header: () => (
        <div className="flex items-center gap-1">
          <GitPullRequest className="w-4 h-4" /> Opened
        </div>
      ),
      cell: ({ row }) => <span className="font-mono">{row.original.prsOpened}</span>,
    },
    {
      accessorKey: 'prsReviewed',
      header: () => (
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" /> Reviewed
        </div>
      ),
      cell: ({ row }) => <span className="font-mono">{row.original.prsReviewed}</span>,
    },
    {
      accessorKey: 'avgCycleTime',
      header: () => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Avg Cycle
        </div>
      ),
      cell: ({ row }) => <span className="font-mono">{row.original.avgCycleTime}h</span>,
    },
    {
      accessorKey: 'avgTurnaround',
      header: 'Turnaround',
      cell: ({ row }) => <span className="font-mono">{row.original.avgTurnaround}h</span>,
    },
  ]

  const filteredTeam = team.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <Page className="p-8">
        <PageHeader>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </PageHeader>
        <PageBody>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </PageBody>
      </Page>
    )
  }

  return (
    <Page className="p-8 animate-fade-in">
      <PageHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <PageTitle>Team Performance</PageTitle>
            <PageDescription>Analyze individual developer metrics and throughput.</PageDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search members..." 
                className="pl-10 w-[240px]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
          </div>
        </div>
      </PageHeader>

      <PageBody>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle>Team Directory</CardTitle>
            </div>
            <Badge variant="secondary" className="px-3 py-1">{team.length} Members</Badge>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={filteredTeam} 
              searchable={false}
              className="border-none"
            />
          </CardContent>
        </Card>
      </PageBody>
    </Page>
  )
}
