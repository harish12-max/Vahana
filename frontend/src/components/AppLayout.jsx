import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LogoutButton from './LogoutButton.jsx'

const navigation = {
  ADVERTISER: [
    ['Dashboard', '/dashboard'], ['Business Profile', '/advertiser/profile'], ['Campaigns', '/advertiser/campaigns'],
  ],
  AUTO_OWNER: [
    ['Dashboard', '/dashboard'], ['My Profile', '/auto-owner/profile'], ['My Vehicles', '/vehicles'], ['My Documents', '/vehicle-documents'], ['Campaigns', '/auto-owner/campaigns'],
  ],
  ADMIN: [
    ['Dashboard', '/dashboard'], ['Campaign Review', '/admin/campaigns'], ['Vehicle Review', '/admin'], ['User Overview', '/admin/users'],
  ],
}

const roleName = (role) => role === 'AUTO_OWNER' ? 'AUTO OWNER' : role

export default function AppLayout({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  const links = navigation[user?.role] || []
  const initials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'V'
  return <div className="app-shell"><aside className="app-sidebar"><Link to="/dashboard" className="brand"><span className="brand-mark">V</span><span>VAHANA</span></Link><p className="role-label">{roleName(user?.role)}</p><nav className="side-nav" aria-label="Application navigation">{links.map(([label, to]) => <Link key={to} to={to} className={location.pathname === to ? 'nav-link active' : 'nav-link'}><span className="nav-dot" aria-hidden="true" />{label}</Link>)}</nav><div className="sidebar-foot">Move local advertising forward.</div></aside><div className="app-main"><header className="app-topbar"><div><p className="topbar-kicker">VAHANA PLATFORM</p><p className="topbar-title">{roleName(user?.role)} PORTAL</p></div><div className="user-menu"><span className="user-avatar" aria-hidden="true">{initials}</span><span className="hidden text-right sm:block"><strong className="block text-sm text-[var(--color-primary)]">{user?.name}</strong><span className="text-xs text-[var(--color-muted)]">{user?.email}</span></span><LogoutButton className="logout-link" /></div></header>{children}</div></div>
}
