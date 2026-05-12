import { Navigate } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../services/auth'

export default function ProtectedRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
