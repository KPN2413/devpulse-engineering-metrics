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

type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  activity: string
  prs: number
  reviews: number
}

const columns: ColumnDef<TeamMember>[] = [
  { 
    accessorKey: 'name', 
    header: 'Member',
    cell: ({ row }) => <Persona name={row.original.name} subtitle={row.original.email} src={`https://avatar.vercel.sh/${row.original.name}`} />
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
  { 
    accessorKey: 'reviews', 
    header: 'Reviews Done',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-bold text-foreground">
        <MessageSquare size={14} className="text-accent" />
        {row.original.reviews}
      </div>
    )
  },
  { 
    accessorKey: 'activity', 
    header: 'Recent Activity',
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.activity}</span>
  },
]

const teamData: TeamMember[] = [
  { id: '1', name: 'Kai Chen', email: 'kai@devpulse.com', role: 'Engineering Lead', activity: 'Merged feat: metrics dashboard', prs: 124, reviews: 342 },
  { id: '2', name: 'Sarah Smith', email: 'sarah@devpulse.com', role: 'Frontend Engineer', activity: 'Commented on database PR', prs: 89, reviews: 156 },
  { id: '3', name: 'Mike Ross', email: 'mike@devpulse.com', role: 'Backend Engineer', activity: 'Created fix: connection leak', prs: 67, reviews: 231 },
  { id: '4', name: 'Jessica Pearson', email: 'jessica@devpulse.com', role: 'Product Manager', activity: 'Reviewed docs PR', prs: 12, reviews: 450 },
]

export function TeamPage() {
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
              data={teamData} 
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
                Team Composition
              </CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">Role distribution across your engineering organization.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {[
                  { label: 'Engineering', count: 12, color: 'bg-primary' },
                  { label: 'Product', count: 4, color: 'bg-accent' },
                  { label: 'Design', count: 3, color: 'bg-foreground' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{item.label}</span>
                      <span>{Math.round((item.count / 19) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 19) * 100}%` }} />
                    </div>
                  </div>
                ))}
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
