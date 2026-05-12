import { useEffect, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import api from '../services/api'
import Navbar from '../components/Navbar'

const COLORS = {
  Beginner: '#f97316',
  Intermediate: '#3b82f6',
  Expert: '#10b981',
  Unknown: '#94a3b8',
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/results/me/analytics')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading analytics...</div>
      </div>
    )
  }

  if (!data || data.total_attempts === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <div className="text-5xl mb-3">📊</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">No data yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Take a test first to see your analytics
            </p>
          </div>
        </div>
      </div>
    )
  }

  const scoreHistory = data.score_history.map((h, i) => ({
    name: `#${i + 1}`,
    score: h.score,
    accuracy: h.accuracy,
  }))

  const levelData = Object.entries(data.level_distribution).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Your performance over time
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-slide-up">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Total Attempts</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {data.total_attempts}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Avg Score</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {data.avg_score.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Avg Accuracy</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {data.avg_accuracy.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Score history line chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Score & Accuracy Trend
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Level distribution pie */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Competency Distribution
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={(e) => `${e.name}: ${e.value}`}
                >
                  {levelData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Score by attempt bar chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Score by Attempt
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="score" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  )
}
