import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-[#102a43]">
        <p className="text-sm font-semibold">Loading...</p>
      </main>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicRoute
