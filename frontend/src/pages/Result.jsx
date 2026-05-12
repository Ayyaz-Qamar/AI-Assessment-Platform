import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

const levelStyles = {
  Beginner: { gradient: 'from-orange-500 to-rose-500', bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-700 dark:text-orange-300', emoji: '🌱' },
  Intermediate: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-300', emoji: '⚡' },
  Expert: { gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10', text: 'text-emerald-700 dark:text-emerald-300', emoji: '🏆' },
}

export default function Result() {
  const { attemptId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    api.get(`/api/results/${attemptId}`)
      .then((r) => setData(r.data))
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load result'))
      .finally(() => setLoading(false))
  }, [attemptId])

  const downloadCertificate = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      const res = await api.get(`/api/certificates/${attemptId}/download`, {
        responseType: 'blob',
      })
      // Extract filename from header if available
      const cd = res.headers['content-disposition'] || ''
      const match = cd.match(/filename="(.+?)"/)
      const filename = match ? match[1] : `AssessAI_Certificate_${attemptId}.pdf`

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to download certificate')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl">
            {error}
          </div>
        </div>
      </div>
    )
  }

  const style = levelStyles[data.competency_level] || levelStyles.Beginner
  const newBadges = data.newly_earned_badges || []
  const isExpert = (data.competency_level || '').toLowerCase() === 'expert'

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* New badges celebration */}
        {newBadges.length > 0 && (
          <div className="mb-6 bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-pink-900/30 rounded-2xl p-6 border-2 border-amber-300 dark:border-amber-700 shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
              🎉 New Badge{newBadges.length > 1 ? 's' : ''} Unlocked!
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {newBadges.map((b) => (
                <div key={b.code} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl p-4 flex items-center gap-3 animate-slide-up shadow-sm">
                  <div className="text-4xl">{b.icon}</div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{b.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🎓 CERTIFICATE — only Expert level */}
        {isExpert && (
          <div className="mb-6 bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30 rounded-2xl p-6 border-2 border-amber-400 dark:border-amber-600 shadow-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl opacity-10 pointer-events-none select-none">🏅</div>
            <div className="relative flex items-start gap-4 flex-wrap">
              <div className="text-6xl">🎓</div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                  Congratulations! Certificate Available
                </h2>
                <p className="text-amber-800 dark:text-amber-200 mt-1">
                  You reached <strong>Expert</strong> level — download your official certificate as proof.
                </p>
              </div>
              <button
                onClick={downloadCertificate}
                disabled={downloading}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition shadow-lg flex items-center gap-2"
              >
                {downloading ? 'Generating...' : '⬇ Download PDF'}
              </button>
            </div>
          </div>
        )}

        {/* Hero card */}
        <div className={`bg-gradient-to-br ${style.gradient} rounded-2xl p-8 text-white shadow-xl mb-6 animate-fade-in`}>
          <div className="text-center">
            <div className="text-6xl mb-3">{style.emoji}</div>
            <p className="text-white/80 text-sm uppercase tracking-wide">Your Competency Level</p>
            <h1 className="text-4xl sm:text-5xl font-bold mt-1">{data.competency_level}</h1>
            <div className="mt-6 inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="text-3xl font-bold">{data.score?.toFixed(1)}%</span>
              <span className="text-sm ml-2 text-white/80">final score</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6 animate-slide-up">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Accuracy</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{data.accuracy?.toFixed(1)}%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Correct</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{data.correct_answers}/{data.total_questions}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Avg Difficulty</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{data.avg_difficulty?.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Total Time</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{Math.round(data.attempt_time)}s</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Avg/Q</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{data.avg_time_per_question?.toFixed(1)}s</p>
          </div>
        </div>

        {/* AI prediction */}
        {data.predicted_level && (
          <div className={`${style.bg} rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-800`}>
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">ML Prediction</p>
                <p className={`font-semibold ${style.text}`}>Our AI also predicts your level as <strong>{data.predicted_level}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Weak areas */}
        {data.weak_areas && data.weak_areas.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">⚠️ Weak Areas</h3>
            <div className="space-y-2">
              {data.weak_areas.map((w, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg">
                  <span className="capitalize font-medium text-slate-900 dark:text-slate-100">{w.difficulty} questions</span>
                  <span className="text-sm text-rose-700 dark:text-rose-300">{w.accuracy?.toFixed(0)}% accuracy ({w.correct}/{w.total})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">💡 Recommendations</h3>
            <ul className="space-y-2">
              {data.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard" className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition">
            ← Dashboard
          </Link>
          <Link to={`/review/${attemptId}`} className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md">
            📝 Review Answers
          </Link>
          <Link to="/analytics" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md">
            View Analytics →
          </Link>
          <Link to="/leaderboard" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md">
            🏆 Leaderboard
          </Link>
          <Link to="/profile" className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md">
            🎖 My Badges
          </Link>
        </div>
      </main>
    </div>
  )
}
