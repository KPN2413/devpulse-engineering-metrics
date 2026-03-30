import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@blinkdotnew/sdk';

const app = new Hono();

app.use('*', cors());

const getBlink = (env: Record<string, string>) =>
  createClient({
    projectId: env.BLINK_PROJECT_ID,
    secretKey: env.BLINK_SECRET_KEY,
  });

app.get('/health', (c) => c.json({ ok: true }));

// GitHub Webhook handler
app.post('/webhooks/github', async (c) => {
  const env = c.env as Record<string, string>;
  const blink = getBlink(env);
  const body = await c.req.json();
  const eventType = c.req.header('X-GitHub-Event');

  // Log event
  await blink.db.webhookEvents.create({
    userId: 'system', // or extract from secret if mapped
    type: eventType || 'unknown',
    payload: JSON.stringify(body),
    processedAt: new Date().toISOString(),
  });

  return c.json({ success: true });
});

// API Routes
app.get('/api/repos', async (c) => {
  const env = c.env as Record<string, string>;
  const blink = getBlink(env);
  const auth = await blink.auth.verifyToken(c.req.header('Authorization'));
  if (!auth.valid) return c.json({ error: 'Unauthorized' }, 401);

  const repos = await blink.db.repositories.list({
    where: { userId: auth.userId }
  });
  return c.json(repos);
});

app.get('/api/metrics/:repoId', async (c) => {
  const env = c.env as Record<string, string>;
  const blink = getBlink(env);
  const auth = await blink.auth.verifyToken(c.req.header('Authorization'));
  if (!auth.valid) return c.json({ error: 'Unauthorized' }, 401);

  const repoId = c.req.param('repoId');
  const metrics = await blink.db.metrics.list({
    where: { repositoryId: repoId, userId: auth.userId }
  });
  return c.json(metrics);
});

app.get('/api/team', async (c) => {
  const env = c.env as Record<string, string>;
  const blink = getBlink(env);
  const auth = await blink.auth.verifyToken(c.req.header('Authorization'));
  if (!auth.valid) return c.json({ error: 'Unauthorized' }, 401);

  const team = await blink.db.teamMembers.list({
    where: { userId: auth.userId }
  });
  return c.json(team);
});

export default app;
