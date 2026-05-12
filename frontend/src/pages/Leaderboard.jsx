import { useEffect, useState } from 'react'
import api from '../services/api'
import Navbar from '../components/Navbar'

const CATEGORIES = [
  { value: 'global', label: 'Global' },
  { value: 'AI', label: 'AI' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'CS', label: 'Computer Science' },
  { value: 'IT', label: 'IT' },
  { value: 'Cyber Security', label: 'Cyber Security' },
  { value: 'Civil Engineering', label: 'Civil' },
  { value: 'Electrical Engineering', label: 'Electrical' },
  { value: 'Islamic Studies', label: 'Islamic Studies' },
]

const rankStyle = (rank) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
  if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-500 text-white'
  if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
  return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
}

const rankIcon = (rank) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '#' + rank)

const levelBadge = (lvl) => {
  const map = {
    Expert: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    Intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Beginner: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  }
  return map[lvl] || 'bg-slate-100 text-slate-700'
}

export default function Leaderboard() {
  const [category, setCategory] = useState('global')
  const [entries, setEntries] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let url = '/api/leaderboard/global?limit=20'
    if (category !== 'global') {
      url = '/api/leaderboard/department/' + encodeURIComponent(category) + '?limit=20'
    }
    setLoading(true)
    Promise.all([
      api.get(url),
      category === 'global' ? api.get('/api/leaderboard/my-rank') : Promise.resolve({ data: null }),
    ])
      .then(([listRes, rankRes]) => {
        setEntries(listRes.data)
        setMyRank(rankRes.data)
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <span className="text-4xl">🏆</span> Leaderboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Top performers ranked by average score</p>
        </div>

        {myRank && category === 'global' && myRank.rank && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 mb-6 text-white shadow-lg animate-slide-up">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-white/80 text-sm">Your Global Rank</p>
                <p className="text-3xl font-bold">#{myRank.rank} <span className="text-base font-normal text-white/80">of {myRank.total}</span></p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Avg Score</p>
                <p className="text-3xl font-bold">{myRank.avg_score.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                category === c.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-slate-500 dark:text-slate-400">No attempts in this category yet</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Avg Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase hidden sm:table-cell">Best</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase hidden sm:table-cell">Attempts</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {entries.map((e) => (
                  <tr
                    key={e.user_id}
                    className={`transition ${
                      e.is_you
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg text-sm font-bold ${rankStyle(e.rank)}`}>
                        {rankIcon(e.rank)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {e.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {e.name} {e.is_you && <span className="text-xs text-blue-600 dark:text-blue-400 font-normal">(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {e.avg_score.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                      {e.best_score.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                      {e.total_attempts}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {e.competency_level && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelBadge(e.competency_level)}`}>
                          {e.competency_level}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
