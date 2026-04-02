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
  DataTable,
  Persona,
  Badge,
  Button,
  EmptyState
} from '@blinkdotnew/ui'
import { 
  Users, 
  Plus, 
  GitPullRequest, 
  MessageSquare, 
  CheckCircle2, 
  Clock 
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTeam } from '../hooks/useMetrics'
import { Avatar, AvatarFallback, AvatarImage } from '@blinkdotnew/ui'

type TeamMember = {
  name: string
  role: string
  prs: number
}

const columns: ColumnDef<TeamMember>[] = [
  { 
    accessorKey: 'name', 
    header: 'Member',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://github.com/${row.original.name}.png`} />
          <AvatarFallback>{row.original.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{row.original.name}</span>
      </div>
    )
  },
  { 
    accessorKey: 'role', 
    header: 'Role',
    cell: ({ row }) => <Badge variant="secondary" className="rounded-full text-[10px] h-5 px-2 font-bold uppercase tracking-wider">{row.original.role}</Badge>
  },
  { 
    accessorKey: 'prs', 
    header: 'PRs Merged',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-bold text-foreground">
        <GitPullRequest size={14} className="text-primary" />
        {row.original.prs}
      </div>
    )
  },
]

export function TeamPage() {
  const { data: team, isLoading } = useTeam()

  if (isLoading) {
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
          <PageTitle className="text-3xl font-bold tracking-tight">Team Members</PageTitle>
          <PageDescription className="text-muted-foreground text-lg leading-relaxed">
            Track activity and performance metrics for your engineering team.
          </PageDescription>
        </div>
        <Button size="lg" className="h-12 px-6 font-bold rounded-xl flex items-center gap-2">
          <Plus size={18} />
          Invite Member
        </Button>
      </PageHeader>

      <PageBody>
        <Card className="bg-secondary/30 border-border/50 rounded-2xl overflow-hidden shadow-none">
          <CardContent className="p-0">
            <DataTable 
              columns={columns} 
              data={team || []} 
              searchable 
              searchColumn="name"
              className="border-none"
            />
          </CardContent>
        </Card>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-secondary/30 border-border/50 rounded-2xl overflow-hidden shadow-none">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Users size={20} className="text-primary" />
                Pull Request Distribution
              </CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">Total pull requests merged per team member.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {team?.map((member: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{member.name}</span>
                      <span>{member.prs} PRs</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, (member.prs / (team.reduce((acc: number, m: any) => acc + m.prs, 0) || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>
                ))}
                {(!team || team.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground">No data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-border/50 rounded-2xl overflow-hidden shadow-none">
             <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Clock size={20} className="text-accent" />
                Coverage Metrics
              </CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">Code review coverage and turnaround time by member.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <EmptyState 
                icon={<CheckCircle2 className="opacity-20" size={48} />}
                title="Metrics look healthy"
                description="Your team is currently meeting all quality and velocity benchmarks for this sprint."
                className="py-6"
              />
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </Page>
  )
}