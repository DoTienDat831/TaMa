import { useState, type FormEvent } from 'react'
import { apiGet, apiPost, type ApiUser, type ApiWorkspace } from '../api/client'

export function useAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<ApiUser | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const establishSession = async (account: ApiUser) => {
    const workspaces = await apiGet<ApiWorkspace[]>(`/workspaces/by-user/${account.id}`)
    let workspace = workspaces[0]
    if (!workspace) {
      workspace = await apiPost<ApiWorkspace>('/workspaces', {
        name: `${account.fullName}'s workspace`,
        createdByUserId: account.id,
      })
    }
    setUser(account)
    setWorkspaceId(workspace.id)
    setIsAuthenticated(true)
    setPassword('')
    setError('')
  }

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      if (isRegistering) {
        await apiPost<ApiUser>('/users', { email, password, fullName })
      }
      const result = await apiPost<{ user: ApiUser }>('/auth/login', { email, password })
      await establishSession(result.user)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to connect to the server')
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setIsAuthenticated(false)
    setUser(null)
    setWorkspaceId(null)
    setPassword('')
    setError('')
  }

  return {
    email, setEmail, password, setPassword, fullName, setFullName,
    isRegistering, setIsRegistering, isAuthenticated, user, workspaceId,
    error, isLoading, signIn, signOut,
  }
}
