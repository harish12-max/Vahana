import { createContext, useContext, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/auth/me')
          setUser(response.data)
      
      } catch { 
          setUser(null)
      } finally {
          setLoading(false)
      }
    }

    checkAuth()

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

export const useAuth = ()=> useContext(AuthContext);