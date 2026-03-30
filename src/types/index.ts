export interface User {
  id: string
  userId: string
  email: string
  displayName: string
  githubId: string
  createdAt: string
}

export interface Repository {
  id: string
  userId: string
  name: string
  owner: string
  githubId: string
  webhookId?: string
  createdAt: string
}

export interface PullRequest {
  id: string
  userId: string
  repositoryId: string
  number: number
  title: string
  state: 'open' | 'closed' | 'merged'
  createdAt: string
  mergedAt?: string
  author: string
}

export interface Commit {
  id: string
  userId: string
  repositoryId: string
  sha: string
  author: string
  message: string
  committedAt: string
}

export interface Metric {
  id: string
  userId: string
  repositoryId: string
  type: 'cycle_time' | 'pr_volume' | 'commit_frequency' | 'review_turnaround'
  value: number
  date: string
}

export interface WebhookEvent {
  id: string
  userId: string
  type: string
  payload: string
  processedAt?: string
  createdAt: string
}
