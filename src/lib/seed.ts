import { blink } from '../blink/client'
import { subDays, format, startOfDay } from 'date-fns'

export async function seedDemoData(userId: string) {
  // Check if data already exists
  const existing = await blink.db.repositories.exists({ where: { userId } })
  if (existing) return

  console.log('Seeding demo data for DevPulse...')

  // 1. Organizations
  const orgId = 'org_' + Math.random().toString(36).substring(7)
  await blink.db.organizations.create({
    id: orgId,
    githubOrgId: '123456',
    name: 'DevPulse Inc',
    slug: 'devpulse',
    userId,
  })

  // 2. Repositories
  const repoId = 'repo_' + Math.random().toString(36).substring(7)
  await blink.db.repositories.create({
    id: repoId,
    githubRepoId: '987654',
    orgId,
    owner: 'devpulse',
    name: 'platform-api',
    fullName: 'devpulse/platform-api',
    isActive: 1,
    userId,
  })

  // 3. Team Members
  const teamMembers = [
    { id: 'user_1', name: 'Sarah Chen', role: 'ADMIN', avatarUrl: 'https://avatar.vercel.sh/sarah' },
    { id: 'user_2', name: 'Alex Rivera', role: 'MEMBER', avatarUrl: 'https://avatar.vercel.sh/alex' },
    { id: 'user_3', name: 'Jordan Smith', role: 'MEMBER', avatarUrl: 'https://avatar.vercel.sh/jordan' },
    { id: 'user_4', name: 'Mika Suzuki', role: 'MEMBER', avatarUrl: 'https://avatar.vercel.sh/mika' },
  ]

  for (const member of teamMembers) {
    await blink.db.users.create({
      id: member.id,
      githubId: 'gh_' + member.id,
      name: member.name,
      avatarUrl: member.avatarUrl,
      role: member.role,
      userId,
    })
  }

  // 4. PRs & Reviews
  const prStates = ['merged', 'closed', 'open']
  for (let i = 0; i < 20; i++) {
    const prId = 'pr_' + i
    const state = prStates[Math.floor(Math.random() * prStates.length)]
    const createdAt = subDays(new Date(), Math.floor(Math.random() * 30))
    const closedAt = state !== 'open' ? subDays(new Date(), Math.floor(Math.random() * 5)) : null
    const mergedAt = state === 'merged' ? closedAt : null
    const authorIdx = Math.floor(Math.random() * teamMembers.length)

    await blink.db.pullRequests.create({
      id: prId,
      githubPrId: 'gh_pr_' + i,
      repoId,
      authorId: teamMembers[authorIdx].id,
      number: 100 + i,
      title: `Feature: Implement ${['OAuth', 'Billing', 'Charts', 'Webhooks', 'Caching'][i % 5]} ${i}`,
      state,
      createdAtGithub: createdAt.toISOString(),
      mergedAt: mergedAt?.toISOString(),
      closedAt: closedAt?.toISOString(),
      cycleTimeMinutes: state === 'merged' ? Math.floor(Math.random() * 2000) + 500 : null,
      userId,
    })

    // Add reviews for merged PRs
    if (state === 'merged') {
      const reviewerIdx = (authorIdx + 1) % teamMembers.length
      await blink.db.pullRequestReviews.create({
        id: 'rev_' + i,
        prId,
        reviewerId: teamMembers[reviewerIdx].id,
        state: 'APPROVED',
        submittedAt: subDays(new Date(), Math.floor(Math.random() * 3)).toISOString(),
        userId,
      })
    }
  }

  // 5. Commits
  for (let i = 0; i < 100; i++) {
    await blink.db.commits.create({
      id: 'commit_' + i,
      githubCommitSha: Math.random().toString(36).substring(7),
      repoId,
      authorId: teamMembers[Math.floor(Math.random() * teamMembers.length)].id,
      committedAt: subDays(new Date(), Math.floor(Math.random() * 30)).toISOString(),
      userId,
    })
  }

  // 6. Deployments
  for (let i = 0; i < 15; i++) {
    await blink.db.deployments.create({
      id: 'dep_' + i,
      repoId,
      environment: i % 3 === 0 ? 'production' : 'staging',
      status: 'success',
      deployedAt: subDays(new Date(), Math.floor(Math.random() * 15)).toISOString(),
      userId,
    })
  }

  // 7. Metric Snapshots (Trends)
  for (let i = 0; i < 30; i++) {
    const date = subDays(new Date(), i)
    await blink.db.metricSnapshots.create({
      id: 'snap_' + i,
      repoId,
      date: format(date, 'yyyy-MM-dd'),
      totalPrs: Math.floor(Math.random() * 5) + 1,
      avgCycleTimeHours: Math.random() * 24 + 12,
      commitCount: Math.floor(Math.random() * 20) + 5,
      avgReviewTurnaroundHours: Math.random() * 8 + 2,
      deploymentCount: Math.floor(Math.random() * 3),
      userId,
    })
  }

  console.log('Seeding complete!')
}
