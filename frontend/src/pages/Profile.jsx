import { useEffect, useState } from 'react'
import api from '../services/api'
import Navbar from '../components/Navbar'

export default function Profile() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/profile/me')
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  if (!data) return null

  const earnedBadges = data.badges.filter((b) => b.earned)
  const lockedBadges = data.badges.filter((b) => !b.earned)
  const earnedCount = earnedBadges.length
  const totalBadges = data.badges.length
  const progressPct = (earnedCount / totalBadges) * 100

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero profile card */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-5xl font-bold border-4 border-white/30">
              {data.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold">{data.user.name}</h1>
              <p className="text-white/80">{data.user.email}</p>
              <p className="text-white/70 text-sm mt-1 capitalize">
                {data.user.role} · Joined {new Date(data.user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold">{earnedCount}</p>
              <p className="text-white/80 text-sm">/ {totalBadges} badges</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Total Attempts</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{data.total_attempts}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Avg Score</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{data.avg_score.toFixed(1)}%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Best Score</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{data.best_score.toFixed(1)}%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Departments</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{data.departments_attempted}/5</p>
          </div>
        </div>

        {/* Badge progress bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Badge Progress</h3>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {earnedCount}/{totalBadges} earned
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Earned badges */}
        {earnedBadges.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              ✨ Earned Badges <span className="text-sm font-normal text-slate-500">({earnedBadges.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges.map((b) => (
                <div
                  key={b.code}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border-2 border-amber-300 dark:border-amber-700 shadow-sm hover:scale-[1.02] transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{b.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{b.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{b.description}</p>
                      {b.earned_at && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                          Earned {new Date(b.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Locked badges */}
        {lockedBadges.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              🔒 To Unlock <span className="text-sm font-normal text-slate-500">({lockedBadges.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedBadges.map((b) => (
                <div
                  key={b.code}
                  className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-90 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl grayscale">{b.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-700 dark:text-slate-300">{b.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{b.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
