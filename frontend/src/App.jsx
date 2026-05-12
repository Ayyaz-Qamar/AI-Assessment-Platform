import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Test from './pages/Test'
import Result from './pages/Result'
import Review from './pages/Review'
import Analytics from './pages/Analytics'
import AdminPanel from './pages/AdminPanel'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import CareerReport from './pages/CareerReport'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/test/:testId" element={<ProtectedRoute><Test /></ProtectedRoute>} />
      <Route path="/result/:attemptId" element={<ProtectedRoute><Result /></ProtectedRoute>} />
      <Route path="/review/:attemptId" element={<ProtectedRoute><Review /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/career" element={<ProtectedRoute><CareerReport /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
