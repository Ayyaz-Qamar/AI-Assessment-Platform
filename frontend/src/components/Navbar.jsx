import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { logout, getUser, isAdmin } from '../services/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">🎯</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AssessAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
            <Link to="/leaderboard" className={linkClass('/leaderboard')}>🏆 Leaderboard</Link>
            <Link to="/career" className={linkClass('/career')}>💼 Career</Link>
            <Link to="/analytics" className={linkClass('/analytics')}>Analytics</Link>
            <Link to="/profile" className={linkClass('/profile')}>🎖 Profile</Link>
            {isAdmin() && (
              <Link to="/admin" className={linkClass('/admin')}>Admin</Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <div className="hidden sm:block text-sm text-slate-600 dark:text-slate-300">
              {user?.name}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <Link to="/leaderboard" className={linkClass('/leaderboard')}>🏆</Link>
          <Link to="/career" className={linkClass('/career')}>💼</Link>
          <Link to="/analytics" className={linkClass('/analytics')}>Analytics</Link>
          <Link to="/profile" className={linkClass('/profile')}>🎖</Link>
          {isAdmin() && <Link to="/admin" className={linkClass('/admin')}>Admin</Link>}
        </div>
      </div>
    </nav>
  )
}
