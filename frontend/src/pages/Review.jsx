import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

const diffStyle = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
}

export default function Review() {
  const { attemptId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | wrong | correct

  useEffect(() => {
    api.get(`/api/results/${attemptId}/review`)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }, [attemptId])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading review...</div>
      </div>
    )
  }

  if (!data) return null

  const items = data.items || []
  const correctCount = items.filter((i) => i.is_correct).length
  const wrongCount = items.length - correctCount

  const filtered =
    filter === 'all'
      ? items
      : filter === 'correct'
      ? items.filter((i) => i.is_correct)
      : items.filter((i) => !i.is_correct)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 animate-fade-in">
          <Link
            to={`/result/${attemptId}`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to result
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2 flex items-center gap-3">
            <span className="text-4xl">📝</span> Answer Review
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Walk through every question and see what you got right or wrong
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Total</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{items.length}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800 text-center">
            <p className="text-xs text-emerald-700 dark:text-emerald-300 uppercase">Correct</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{correctCount}</p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800 text-center">
            <p className="text-xs text-rose-700 dark:text-rose-300 uppercase">Wrong</p>
            <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">{wrongCount}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { v: 'all', label: `All (${items.length})` },
            { v: 'correct', label: `✅ Correct (${correctCount})` },
            { v: 'wrong', label: `❌ Wrong (${wrongCount})` },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setFilter(t.v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === t.v
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {filtered.map((q) => {
            const wasTimedOut = q.timed_out
            const userOpt = (q.selected_option || '').toUpperCase()
            const correctOpt = (q.correct_option || '').toUpperCase()

            return (
              <div
                key={q.question_id}
                className={`bg-white dark:bg-slate-900 rounded-xl p-5 border-2 ${
                  q.is_correct
                    ? 'border-emerald-200 dark:border-emerald-900'
                    : 'border-rose-200 dark:border-rose-900'
                }`}
              >
                {/* Question header */}
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      Q{q.number}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full uppercase ${diffStyle[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      ⏱ {q.time_taken}s
                    </span>
                    {wasTimedOut && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        ⏰ Timed out
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      q.is_correct
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                    }`}
                  >
                    {q.is_correct ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                {/* Question text */}
                <p className="font-medium text-slate-900 dark:text-slate-100 mb-4">
                  {q.text}
                </p>

                {/* Options */}
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const isCorrect = opt === correctOpt
                    const isUserPicked = opt === userOpt
                    const text = q[`option_${opt.toLowerCase()}`]

                    let cls =
                      'p-3 rounded-lg border-2 flex items-start gap-3 transition'
                    let badge = null

                    if (isCorrect) {
                      cls += ' border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20'
                      badge = <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">✓ Correct Answer</span>
                    } else if (isUserPicked && !q.is_correct) {
                      cls += ' border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-900/20'
                      badge = <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Your Answer</span>
                    } else {
                      cls += ' border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }

                    return (
                      <div key={opt} className={cls}>
                        <div
                          className={`w-7 h-7 flex items-center justify-center rounded-full font-semibold text-xs flex-shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isUserPicked && !q.is_correct
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {opt}
                        </div>
                        <div className="flex-1">
                          <span className="text-slate-900 dark:text-slate-100 text-sm">{text}</span>
                          {badge && <div className="mt-1">{badge}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Special hint when no answer was picked */}
                {!userOpt && (
                  <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
                    ⚠️ You didn't pick any answer for this question.
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No questions match this filter.
          </div>
        )}

        <div className="mt-8">
          <Link
            to={`/result/${attemptId}`}
            className="inline-block px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            ← Back to result
          </Link>
        </div>
      </main>
    </div>
  )
}
