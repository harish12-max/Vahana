import { createContext, useContext, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/auth/me')
        if (active) {
          setUser(response.data?.data?.user ?? null)
        }
      } catch {
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      active = false
    }
  }, [])

  const logout = async () => {
    const response = await axiosInstance.post('/auth/logout')

    if (!response.data?.success) {
      throw new Error('Logout was not completed.')
    }

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
