// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import type { User } from '@/types'
import { login as apiLogin, getSavedUser, clearAuth } from '@/services/auth'

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore user from localStorage (if any)
  useEffect(() => {
    const savedUser = getSavedUser()
    if (savedUser) {
      setCurrentUser(savedUser)
    }
    setLoading(false)
  }, [])

  // Directly set user (used after successful login from Login component)
  const setUser = (user: User) => {
    setCurrentUser(user)
  }

  // Login with email & password → calls your Flask backend
  const login = async (email: string, password: string) => {
    try {
      const result = await apiLogin(email, password)
      setCurrentUser(result.user)
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Logout – clears everything
  const logout = () => {
    clearAuth()
    setCurrentUser(null)
  }

  // Optional: update profile locally (if you later support editing)
  const saveProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updates }
      setCurrentUser(updated)
      // Optionally update localStorage
      localStorage.setItem('exam_evaluate_user', JSON.stringify(updated))
    }
  }

  return { currentUser, loading, setUser, login, logout, saveProfile }
}