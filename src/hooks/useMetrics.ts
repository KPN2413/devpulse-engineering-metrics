import { useQuery } from '@tanstack/react-query'

const BACKEND_URL = `https://${import.meta.env.VITE_BLINK_PROJECT_ID}.backend.blink.new`;

export function useRepos() {
  const token = localStorage.getItem('devpulse_token')
  return useQuery({
    queryKey: ['repos'],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/repos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch repos')
      return res.json()
    },
    enabled: !!token
  })
}

export function useMetrics(repoId: string | null) {
  const token = localStorage.getItem('devpulse_token')
  return useQuery({
    queryKey: ['metrics', repoId],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/metrics/${repoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch metrics')
      return res.json()
    },
    enabled: !!token && !!repoId
  })
}
