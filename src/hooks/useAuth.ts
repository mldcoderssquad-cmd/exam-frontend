import { useState } from 'react'
import type { User, UserRole } from '@/types'
import { MOCK_USERS } from '@/services'

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const login = (role: UserRole): User => {
    const user = MOCK_USERS[role]
    setCurrentUser(user)
    return user
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const saveProfile = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates })
    }
  }

  return { currentUser, login, logout, saveProfile }
}
