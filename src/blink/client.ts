import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'devpulse-dashboard-f6b05h7q',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_SLKzJ1IGnGXpmcNzIZVg9l6_BqmVQdMa',
  auth: { mode: 'managed' },
})
