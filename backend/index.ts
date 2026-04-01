import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client/edge';
import { Redis } from '@upstash/redis';
import * as jose from 'jose';

type Bindings = {
  DATABASE_URL: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_WEBHOOK_SECRET: string;
  BLINK_SECRET_KEY: string;
  BLINK_PROJECT_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// Initializing clients lazily
let _prisma: PrismaClient | null = null;
const getPrisma = (env: Bindings) => {
  if (!_prisma) {
    _prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    });
  }
  return _prisma;
};

let _redis: Redis | null = null;
const getRedis = (env: Bindings) => {
  if (!_redis) {
    _redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
};

// JWT Helper
const signToken = async (payload: any, secret: string) => {
  const secretKey = new TextEncoder().encode(secret);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
};

const verifyToken = async (token: string, secret: string) => {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload;
  } catch (e) {
    return null;
  }
};

// --- Auth Routes ---

app.get('/api/auth/github', (c) => {
  const env = c.env;
  const redirectUri = `https://${env.BLINK_PROJECT_ID}.backend.blink.new/api/auth/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user,repo,write:repo_hook`;
  return c.redirect(url);
});

app.get('/api/auth/callback', async (c) => {
  const env = c.env;
  const code = c.req.query('code');
  if (!code) return c.json({ error: 'Missing code' }, 400);

  // Exchange code for token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json() as any;
  if (tokenData.error) return c.json(tokenData, 400);

  const accessToken = tokenData.access_token;

  // Get user info
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'DevPulse-Blink',
    },
  });
  const userData = await userRes.json() as any;

  const prisma = getPrisma(env);
  const user = await prisma.user.upsert({
    where: { githubId: String(userData.id) },
    update: {
      githubAccessToken: accessToken,
      displayName: userData.name || userData.login,
      email: userData.email,
    },
    create: {
      githubId: String(userData.id),
      githubAccessToken: accessToken,
      displayName: userData.name || userData.login,
      email: userData.email,
    },
  });

  const sessionToken = await signToken({ userId: user.id }, env.BLINK_SECRET_KEY);

  // Redirect to frontend
  const frontendUrl = c.req.header('Referer') || `https://${env.BLINK_PROJECT_ID}.blink.new`;
  const redirectUrl = new URL(frontendUrl);
  redirectUrl.searchParams.set('token', sessionToken);
  
  return c.redirect(redirectUrl.toString());
});

app.get('/api/auth/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token, c.env.BLINK_SECRET_KEY);
  if (!payload || !payload.userId) return c.json({ error: 'Invalid token' }, 401);

  const prisma = getPrisma(c.env);
  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
  });

  if (!user) return c.json({ error: 'User not found' }, 404);

  return c.json(user);
});

// --- Webhooks ---

app.post('/webhooks/github', async (c) => {
  const env = c.env;
  const signature = c.req.header('X-Hub-Signature-256');
  const eventType = c.req.header('X-GitHub-Event');
  const bodyText = await c.req.text();

  // Validate signature
  if (!signature) return c.json({ error: 'Missing signature' }, 401);
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.GITHUB_WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const sigHex = signature.replace('sha256=', '');
  const sigBytes = new Uint8Array(sigHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    sigBytes,
    encoder.encode(bodyText)
  );

  if (!isValid) return c.json({ error: 'Invalid signature' }, 401);

  const payload = JSON.parse(bodyText);
  const prisma = getPrisma(env);

  // Store raw event
  const repoGithubId = payload.repository?.id ? String(payload.repository.id) : null;
  let repoId: string | null = null;
  
  if (repoGithubId) {
    const repo = await prisma.repository.findUnique({
      where: { githubId: repoGithubId }
    });
    repoId = repo?.id || null;
  }

  const webhookEvent = await prisma.webhookEvent.create({
    data: {
      repoId,
      eventType: eventType || 'unknown',
      payload: payload,
    },
  });

  // Async aggregation (in Workers we use waitUntil)
  c.executionCtx.waitUntil(aggregateData(env, eventType, payload, repoId));

  return c.json({ success: true });
});

async function aggregateData(env: Bindings, eventType: string | undefined, payload: any, repoId: string | null) {
  if (!repoId) return;
  const prisma = getPrisma(env);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (eventType === 'pull_request') {
    const pr = payload.pull_request;
    const action = payload.action;

    if (action === 'closed' || action === 'opened' || action === 'merged') {
      const openedAt = new Date(pr.created_at);
      const mergedAt = pr.merged_at ? new Date(pr.merged_at) : null;
      const closedAt = pr.closed_at ? new Date(pr.closed_at) : null;
      
      let cycleTimeMs: bigint | null = null;
      if (mergedAt) {
        cycleTimeMs = BigInt(mergedAt.getTime() - openedAt.getTime());
      }

      await prisma.pullRequest.upsert({
        where: { githubPrId: String(pr.id) },
        update: {
          title: pr.title,
          mergedAt,
          closedAt,
          cycleTimeMs,
        },
        create: {
          githubPrId: String(pr.id),
          repoId,
          title: pr.title,
          authorLogin: pr.user.login,
          openedAt,
          mergedAt,
          closedAt,
          cycleTimeMs,
        },
      });

      // Update Metric
      if (mergedAt) {
        const prs = await prisma.pullRequest.findMany({
          where: {
            repoId,
            mergedAt: { gte: today },
          },
        });
        
        const mergedPrs = prs.filter(p => p.cycleTimeMs !== null);
        const totalCycleTime = mergedPrs.reduce((acc, p) => acc + Number(p.cycleTimeMs), 0);
        const avgCycleTime = mergedPrs.length > 0 ? totalCycleTime / mergedPrs.length : 0;

        await prisma.metric.upsert({
          where: { repoId_date: { repoId, date: today } },
          update: {
            prCount: prs.length,
            avgCycleTimeMs: avgCycleTime,
          },
          create: {
            repoId,
            date: today,
            prCount: prs.length,
            avgCycleTimeMs: avgCycleTime,
          },
        });
      }
    }
  } else if (eventType === 'push') {
    const commitsCount = payload.commits?.length || 0;
    if (commitsCount > 0) {
      await prisma.metric.upsert({
        where: { repoId_date: { repoId, date: today } },
        update: {
          commitCount: { increment: commitsCount },
        },
        create: {
          repoId,
          date: today,
          commitCount: commitsCount,
        },
      });

      // Optional: Store individual commits if needed
      for (const commit of payload.commits) {
        await prisma.commit.upsert({
          where: { sha: commit.id },
          update: {},
          create: {
            repoId,
            sha: commit.id,
            author: commit.author.name,
            message: commit.message,
            committedAt: new Date(commit.timestamp),
          },
        });
      }
    }
  }
}

// --- APIs ---

app.get('/api/repos', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token, c.env.BLINK_SECRET_KEY);
  if (!payload || !payload.userId) return c.json({ error: 'Invalid token' }, 401);

  const prisma = getPrisma(c.env);
  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
  });

  if (!user || !user.githubAccessToken) return c.json({ error: 'User or token not found' }, 404);

  // Fetch from GitHub
  const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
    headers: {
      Authorization: `Bearer ${user.githubAccessToken}`,
      'User-Agent': 'DevPulse-Blink',
    },
  });

  const repos = await res.json() as any[];
  
  // Optionally sync with DB
  const syncRepos = await Promise.all(repos.map(async (r) => {
    return prisma.repository.upsert({
      where: { githubId: String(r.id) },
      update: { name: r.name, owner: r.owner.login },
      create: {
        userId: user.id,
        githubId: String(r.id),
        name: r.name,
        owner: r.owner.login,
      },
    });
  }));

  return c.json(syncRepos);
});

app.get('/api/metrics/:repoId', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token, c.env.BLINK_SECRET_KEY);
  if (!payload || !payload.userId) return c.json({ error: 'Invalid token' }, 401);

  const repoId = c.req.param('repoId');
  const env = c.env;
  const redis = getRedis(env);
  const cacheKey = `metrics:${repoId}`;

  // Try cache
  const cached = await redis.get(cacheKey);
  if (cached) return c.json(cached);

  const prisma = getPrisma(env);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const metrics = await prisma.metric.findMany({
    where: {
      repoId,
      date: { gte: thirtyDaysAgo },
    },
    orderBy: { date: 'asc' },
  });

  // Store in cache for 5 minutes
  await redis.set(cacheKey, JSON.stringify(metrics), { ex: 300 });

  return c.json(metrics);
});

export default app;
