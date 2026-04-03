import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui'
import { BlinkAuthProvider, BlinkProvider } from '@blinkdotnew/react'
import App from './App'
import './index.css'

const queryClient = new QueryClient()
const projectId = import.meta.env.VITE_BLINK_PROJECT_ID || 'devpulse-dashboard-f6b05h7q'
const publishableKey = import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_SLKzJ1IGnGXpmcNzIZVg9l6_BqmVQdMa'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkProvider projectId={projectId} publishableKey={publishableKey}>
        <BlinkAuthProvider>
          <BlinkUIProvider theme="midnight" darkMode="system">
            <Toaster />
            <App />
          </BlinkUIProvider>
        </BlinkAuthProvider>
      </BlinkProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
