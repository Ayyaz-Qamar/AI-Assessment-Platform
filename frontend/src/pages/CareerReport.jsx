import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

const tierStyle = {
  'Excellent Match': 'from-emerald-500 to-teal-500 text-white',
  'Strong Match': 'from-blue-500 to-cyan-500 text-white',
  'Good Match': 'from-amber-500 to-orange-500 text-white',
  'Possible Match': 'from-slate-400 to-slate-500 text-white',
}

export default function CareerReport() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/career/me')
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Analyzing your performance...</div>
      </div>
    )
  }

  if (!data || !data.ready) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <div className="text-5xl mb-3">💼</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Career insights coming soon</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {data?.message || 'Complete at least one test to see your career match.'}
            </p>
            <Link to="/dashboard" className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
              Take a Test
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <span className="text-4xl">💼</span> Your Career Report
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Career suggestions based on your competency profile
          </p>
        </div>

        {/* Strongest / weakest */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6 animate-slide-up">
          {data.strongest_area && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-5 text-white shadow-md">
              <p className="text-white/80 text-sm uppercase tracking-wide">⭐ Strongest Area</p>
              <p className="text-2xl font-bold mt-1">{data.strongest_area.category}</p>
              <p className="text-white/90">{data.strongest_area.avg_score}% avg score</p>
            </div>
          )}
          {data.weakest_area && data.weakest_area.category !== data.strongest_area?.category && (
            <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl p-5 text-white shadow-md">
              <p className="text-white/80 text-sm uppercase tracking-wide">📚 Area to Improve</p>
              <p className="text-2xl font-bold mt-1">{data.weakest_area.category}</p>
              <p className="text-white/90">{data.weakest_area.avg_score}% avg score</p>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">📊 Your Performance by Subject</h3>
          <div className="space-y-3">
            {Object.entries(data.category_scores).map(([cat, score]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                  <span className="text-slate-600 dark:text-slate-400">{score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career matches */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">🎯 Recommended Careers</h2>
        <div className="space-y-4">
          {data.matches.map((c, idx) => (
            <div
              key={c.code}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div className="text-5xl">{c.icon}</div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {idx === 0 ? '🥇 TOP' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${tierStyle[c.tier]}`}>
                      {c.tier}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{c.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{c.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {c.match_pct}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">match</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">✅ Your Strong Skills</p>
                  <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-0.5">
                    {c.skills_strong.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">📚 Skills to Learn</p>
                  <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-0.5">
                    {c.skills_learn.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                💰 Typical salary range: <strong>{c.salary_range}</strong>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>How this works:</strong> Each career has a skill profile across the 5 subjects. Your match percentage is a weighted average of your scores in the relevant subjects. Take more tests to refine your recommendations.
          </p>
        </div>
      </main>
    </div>
  )
}
