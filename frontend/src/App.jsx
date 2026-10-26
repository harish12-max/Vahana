import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdvertiserProfile from './pages/AdvertiserProfile.jsx'
import AutoOwnerProfile from './pages/AutoOwnerProfile.jsx'
import VehicleManagement from './pages/VehicleManagement.jsx'
import VehicleDocuments from './pages/VehicleDocuments.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdvertiserCampaigns from './pages/AdvertiserCampaigns.jsx'
import AutoOwnerCampaigns from './pages/AutoOwnerCampaigns.jsx'
import AdminCampaigns from './pages/AdminCampaigns.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADVERTISER', 'AUTO_OWNER', 'ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advertiser/profile"
            element={
              <ProtectedRoute allowedRoles={['ADVERTISER']}>
                <AdvertiserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/auto-owner/profile"
            element={
              <ProtectedRoute allowedRoles={['AUTO_OWNER']}>
                <AutoOwnerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles"
            element={
              <ProtectedRoute allowedRoles={['AUTO_OWNER']}>
                <VehicleManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicle-documents"
            element={
              <ProtectedRoute allowedRoles={['AUTO_OWNER']}>
                <VehicleDocuments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advertiser/campaigns"
            element={<ProtectedRoute allowedRoles={['ADVERTISER']}><AdvertiserCampaigns /></ProtectedRoute>}
          />
          <Route
            path="/auto-owner/campaigns"
            element={<ProtectedRoute allowedRoles={['AUTO_OWNER']}><AutoOwnerCampaigns /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>}
          />
          <Route
            path="/admin/campaigns"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCampaigns /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
