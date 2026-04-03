# DevPulse — GitHub Engineering Metrics Dashboard

DevPulse is a comprehensive engineering analytics dashboard that helps software teams measure delivery health using GitHub activity.

## Features
- **Real-time Webhook Processing**: Automatically track PRs, commits, and deployments.
- **Cycle Time Analysis**: Measure the speed of your delivery pipeline from commit to deploy.
- **Review Speed Tracking**: Identify bottlenecks in your code review process and improve throughput.
- **Team Insights**: Understand individual and team contributions with role-aware metrics.
- **Modern Dashboard**: Built with Next.js, Recharts, and shadcn/ui.

## Tech Stack
- **Frontend**: Vite + React (Dashboard), Tailwind CSS, shadcn/ui, TanStack Query, Recharts.
- **Backend**: Hono (Edge Functions) on Blink Backend.
- **Database**: SQLite (Blink DB).
- **Auth**: Blink SDK managed authentication.

## Getting Started

### Prerequisites
- Node.js (LTS)
- A GitHub account and repository to monitor.

### Setup Instructions
1. **Sign In**: Open the DevPulse app and sign in with GitHub via Blink Auth.
2. **Configure Webhooks**:
   - Go to your GitHub repository settings.
   - Add a new webhook with your unique Payload URL (found in Settings).
   - Set the content type to `application/json`.
   - Subscribe to: `Pull Requests`, `Pull Request Reviews`, `Pushes`, `Deployment Status`.
3. **Data Collection**: As activity happens in your repo, DevPulse will automatically update your metrics.

### Local Development
To run the database and local stack:
```bash
docker-compose up -d
npm install
npm run dev
```

## Dashboard Metrics
- **Total PRs**: Total count of pull requests opened and merged.
- **Avg PR Cycle Time**: Time from first commit to PR merge.
- **Commit Frequency**: Average commits per day across the team.
- **Review Turnaround**: Time from PR open to first approved review.
- **Deployment Frequency**: How often you ship to production.

## Project Structure
```
devpulse/
  backend/            # Hono Edge Functions
    index.ts          # Webhook and API logic
  src/                # Frontend React code
    components/       # UI and Layout components
    pages/            # Dashboard, Team, Settings pages
    hooks/            # Auth and Data hooks
    blink/            # SDK client initialization
    lib/              # Utils and Seed logic
  public/             # Static assets
```

Built with ❤️ by Blink.
