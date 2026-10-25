import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdvertiserProfile from './pages/AdvertiserProfile.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={['ADVERTISER', 'AUTO_OWNER', 'ADMIN']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADVERTISER']} />}>
        <Route path="/advertiser/profile" element={<AdvertiserProfile />} />
      </Route>
    </Routes>
  )
}

export default App
