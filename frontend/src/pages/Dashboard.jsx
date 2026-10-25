import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LogoutButton from '../components/LogoutButton.jsx'

function Dashboard() {
  const { user } = useAuth()

  const dashboardNames = {
    ADMIN: 'Admin Dashboard',
    ADVERTISER: 'Advertiser Dashboard',
    AUTO_OWNER: 'Auto Owner Dashboard',
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-amber-600">
                VAHANA
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-[#102a43]">
                {dashboardNames[user.role] || 'Dashboard'}
              </h1>
            </div>
            <LogoutButton className="text-[#102a43]" />
          </div>
          <p className="mt-3 text-slate-600">
            Welcome, {user.name}. Your authentication is working and your role
            is <strong>{user.role}</strong>.
          </p>
          {user.role === 'ADVERTISER' && (
            <Link
              to="/advertiser/profile"
              className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#102a43] px-4 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b]"
            >
              Manage business profile
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

export default Dashboard
