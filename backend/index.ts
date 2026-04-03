import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@blinkdotnew/sdk'

const app = new Hono()

app.use('*', cors())

const getBlink = (env: Record<string, string>) =>
  createClient({
    projectId: env.BLINK_PROJECT_ID,
    secretKey: env.BLINK_SECRET_KEY,
  })

app.get('/health', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }))

/**
 * GitHub Webhook Receiver
 * Parses incoming events and updates metrics accordingly.
 */
app.post('/webhooks/github', async (c) => {
  const blink = getBlink(c.env as Record<string, string>)
  const payload = await c.req.json()
  const eventType = c.req.header('X-GitHub-Event')
  const deliveryId = c.req.header('X-GitHub-Delivery')

  if (!eventType || !deliveryId) {
    return c.json({ error: 'Missing GitHub headers' }, 400)
  }

  try {
    // 1. Check for de-duplication
    const exists = await blink.db.webhookEvents.exists({ where: { deliveryId } })
    if (exists) return c.json({ ok: true, status: 'duplicate' })

    // 2. Extract repository and user info
    const repository = payload.repository
    const sender = payload.sender
    const repoId = repository?.id?.toString()
    
    // 3. Store raw event
    const webhookEvent = await blink.db.webhookEvents.create({
      id: `wh_${deliveryId}`,
      deliveryId,
      eventType,
      repoId,
      rawPayload: JSON.stringify(payload),
      status: 'pending',
      userId: 'system', // In a real app, you'd map this to the org owner
    })

    // 4. Process event based on type
    // This logic updates PullRequest, Commit, Deployment tables
    switch (eventType) {
      case 'pull_request':
        await handlePullRequest(blink, payload)
        break
      case 'pull_request_review':
        await handlePullRequestReview(blink, payload)
        break
      case 'push':
        await handlePush(blink, payload)
        break
      case 'deployment_status':
        await handleDeployment(blink, payload)
        break
    }

    // 5. Update event status
    await blink.db.webhookEvents.update(webhookEvent.id, {
      status: 'processed',
      processedAt: new Date().toISOString()
    })

    return c.json({ ok: true, status: 'processed' })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// --- Helper Handlers (Simplified for v1) ---

async function handlePullRequest(blink: any, payload: any) {
  const pr = payload.pull_request
  const repo = payload.repository
  const action = payload.action

  if (!pr || !repo) return

  const prData = {
    id: `pr_${pr.id}`,
    githubPrId: pr.id.toString(),
    repoId: repo.id.toString(),
    authorId: pr.user.id.toString(),
    number: pr.number,
    title: pr.title,
    state: pr.state === 'closed' && pr.merged ? 'merged' : pr.state,
    createdAtGithub: pr.created_at,
    mergedAt: pr.merged_at,
    closedAt: pr.closed_at,
    cycleTimeMinutes: pr.merged_at 
      ? Math.floor((new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime()) / 60000)
      : null,
    userId: 'system'
  }

  await blink.db.pullRequests.upsert(prData)
}

async function handlePullRequestReview(blink: any, payload: any) {
  const review = payload.review
  const pr = payload.pull_request

  if (!review || !pr) return

  await blink.db.pullRequestReviews.create({
    id: `rev_${review.id}`,
    prId: `pr_${pr.id}`,
    reviewerId: review.user.id.toString(),
    state: review.state.toUpperCase(),
    submittedAt: review.submitted_at,
    userId: 'system'
  })
}

async function handlePush(blink: any, payload: any) {
  const repo = payload.repository
  const commits = payload.commits || []

  for (const commit of commits) {
    await blink.db.commits.upsert({
      id: `commit_${commit.id}`,
      githubCommitSha: commit.id,
      repoId: repo.id.toString(),
      authorId: commit.author.email, // Simple mapping for v1
      committedAt: commit.timestamp,
      userId: 'system'
    })
  }
}

async function handleDeployment(blink: any, payload: any) {
  const deployment = payload.deployment
  const status = payload.deployment_status
  const repo = payload.repository

  if (!deployment || !status || !repo) return

  await blink.db.deployments.create({
    id: `dep_${deployment.id}`,
    repoId: repo.id.toString(),
    environment: deployment.environment,
    status: status.state,
    deployedAt: status.created_at,
    userId: 'system'
  })
}

export default app
