import { useEffect, useState, useCallback } from 'react'
import { blink } from '../blink/client'

export interface User {
  id: string
  email: string | null
  displayName: string | null
  githubId: string
  avatarUrl?: string
}

const BACKEND_URL = `https://${import.meta.env.VITE_BLINK_PROJECT_ID}.backend.blink.new`;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMe = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        localStorage.removeItem('devpulse_token')
        setUser(null)
      }
    } catch (e) {
      console.error('Failed to fetch user', e)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')

    if (tokenFromUrl) {
      localStorage.setItem('devpulse_token', tokenFromUrl)
      // Clean up URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
      fetchMe(tokenFromUrl)
    } else {
      const storedToken = localStorage.getItem('devpulse_token')
      if (storedToken) {
        fetchMe(storedToken)
      } else {
        setIsLoading(false)
      }
    }
  }, [fetchMe])

  const login = () => {
    window.location.href = `${BACKEND_URL}/api/auth/github`
  }

  const logout = () => {
    localStorage.removeItem('devpulse_token')
    setUser(null)
  }

  return { 
    user, 
    isLoading, 
    isAuthenticated: !!user,
    login,
    logout
  }
}
