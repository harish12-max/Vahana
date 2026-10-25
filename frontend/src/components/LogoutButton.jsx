import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LogoutButton({ className = '' }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    setError('')

    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (requestError) {
      setError(
        requestError.response?.data?.error?.message
          || 'We could not log you out. Please try again.',
      )
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-current px-4 text-sm font-bold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
}

export default LogoutButton
