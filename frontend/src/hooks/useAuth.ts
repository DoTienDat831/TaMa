import { useState, type FormEvent } from 'react'

export function useAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim() && password) setIsAuthenticated(true)
  }
  const signOut = () => { setIsAuthenticated(false); setPassword('') }
  return { email, setEmail, password, setPassword, isAuthenticated, signIn, signOut }
}
