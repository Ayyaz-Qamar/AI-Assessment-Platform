import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { getUser } from '../services/auth'
import Navbar from '../components/Navbar'

const levelColors = {
  Beginner: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Expert: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
}

function StatCard({ label, value, icon, gradient }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
        </div>
        <div className={`text-3xl p-3 rounded-xl ${gradient}`}>{icon}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const user = getUser()
  const [tests, setTests] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [recentResults, setRecentResults] = useState([])
  const [careers, setCareers] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [testsRes, analyticsRes, resultsRes, careerRes] = await Promise.all([
          api.get('/api/tests/'),
          api.get('/api/results/me/analytics'),
          api.get('/api/results/me'),
          api.get('/api/career/me/top3').catch(() => ({ data: null })),
        ])
        setTests(testsRes.data)
        setAnalytics(analyticsRes.data)
        setRecentResults(resultsRes.data.slice(0, 5))
        setCareers(careerRes.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your progress and take adaptive assessments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <StatCard
            label="Total Attempts"
            value={analytics?.total_attempts ?? 0}
            icon="📊"
            gradient="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            label="Avg Score"
            value={`${(analytics?.avg_score ?? 0).toFixed(1)}%`}
            icon="🎯"
            gradient="bg-purple-100 dark:bg-purple-900/30"
          />
          <StatCard
            label="Avg Accuracy"
            value={`${(analytics?.avg_accuracy ?? 0).toFixed(1)}%`}
            icon="✅"
            gradient="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <StatCard
            label="Available Tests"
            value={tests.length}
            icon="📝"
            gradient="bg-orange-100 dark:bg-orange-900/30"
          />
        </div>

        {/* Tests grid */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Available Tests
          </h2>
          {loading ? (
            <div className="text-slate-500 dark:text-slate-400">Loading...</div>
          ) : tests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-800">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-slate-500 dark:text-slate-400">
                No tests available yet. {user?.role === 'admin' && 'Create one in the Admin panel!'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((t) => (
                <div
                  key={t.id}
                  className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:scale-[1.02] transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">📚</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {t.question_count} questions
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {t.description || 'No description'}
                  </p>
                  <Link
                    to={`/test/${t.id}`}
                    className="inline-block w-full text-center py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    Start Test →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Career matches preview */}
        {careers && careers.ready && careers.matches && careers.matches.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                💼 Recommended Careers
              </h2>
              <Link to="/career" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View Full Report →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {careers.matches.slice(0, 3).map((c, idx) => (
                <Link
                  to="/career"
                  key={c.code}
                  className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:scale-[1.02] transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl">{c.icon}</div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{c.tagline}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{c.tier}</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {c.match_pct}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent results */}
        {recentResults.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Recent Attempts
            </h2>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Test</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {recentResults.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {r.test_title}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                        {r.score?.toFixed(1) ?? '-'}%
                      </td>
                      <td className="px-4 py-3">
                        {r.competency_level && (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${levelColors[r.competency_level] || ''}`}>
                            {r.competency_level}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                        {new Date(r.started_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/result/${r.id}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
