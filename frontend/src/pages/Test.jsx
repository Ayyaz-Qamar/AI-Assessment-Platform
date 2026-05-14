import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

const difficultyStyle = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
}

const DEFAULT_MAX_Q = 30
const DEFAULT_TIME_PER_Q = 90       // 90 seconds per question
const DEFAULT_TOTAL_TIME = 45 * 60  // 45 minutes total

function formatMMSS(secs) {
  const s = Math.max(0, Math.floor(secs))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export default function Test() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [attemptId, setAttemptId] = useState(null)
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState('')
  const [answered, setAnswered] = useState(0)
  const [maxQuestions, setMaxQuestions] = useState(DEFAULT_MAX_Q)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Per-question timer
  const [timePerQ, setTimePerQ] = useState(DEFAULT_TIME_PER_Q)
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_TIME_PER_Q)

  // Overall test timer (45 min cap)
  const [totalTime, setTotalTime] = useState(DEFAULT_TOTAL_TIME)
  const [overallLeft, setOverallLeft] = useState(DEFAULT_TOTAL_TIME)

  const startedAt = useRef(Date.now())
  const overallStartedAt = useRef(Date.now())
  const tickerRef = useRef(null)
  const overallRef = useRef(null)
  const submittingRef = useRef(false)

  // ---- start attempt ----
  useEffect(() => {
    let cancelled = false
    const start = async () => {
      try {
        const { data } = await api.post('/api/adaptive/start', { test_id: parseInt(testId) })
        if (cancelled) return
        const tpq = data.time_per_question || DEFAULT_TIME_PER_Q
        const totT = data.total_time_seconds || DEFAULT_TOTAL_TIME
        setTimePerQ(tpq)
        setSecondsLeft(tpq)
        setTotalTime(totT)
        setOverallLeft(totT)
        setMaxQuestions(data.max_questions || DEFAULT_MAX_Q)
        setAttemptId(data.attempt_id)
        setQuestion(data.question)
        startedAt.current = Date.now()
        overallStartedAt.current = Date.now()
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to start test')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    start()
    return () => { cancelled = true }
  }, [testId])

  // ---- per-question timer ----
  useEffect(() => {
    if (!question || submitting) return
    clearInterval(tickerRef.current)
    setSecondsLeft(timePerQ)
    startedAt.current = Date.now()

    tickerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(tickerRef.current)
          if (!submittingRef.current) {
            submittingRef.current = true
            submitAnswer(true) // per-question timeout
          }
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(tickerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id])

  // ---- overall 45-min timer (runs continuously regardless of question) ----
  useEffect(() => {
    if (!attemptId) return
    clearInterval(overallRef.current)
    overallRef.current = setInterval(() => {
      const elapsed = (Date.now() - overallStartedAt.current) / 1000
      const remaining = Math.max(0, totalTime - elapsed)
      setOverallLeft(remaining)
      if (remaining <= 0) {
        clearInterval(overallRef.current)
        clearInterval(tickerRef.current)
        if (!submittingRef.current) {
          submittingRef.current = true
          submitAnswer(true) // overall timeout -> last question auto-submitted, backend finalizes
        }
      }
    }, 1000)
    return () => clearInterval(overallRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, totalTime])

  // ---- submit ----
  const submitAnswer = async (timedOut = false) => {
    if (submitting) return
    if (!timedOut && !selected) return
    setSubmitting(true)
    submittingRef.current = true
    clearInterval(tickerRef.current)

    const time_taken = (Date.now() - startedAt.current) / 1000
    try {
      const { data } = await api.post('/api/adaptive/submit-answer', {
        attempt_id: attemptId,
        question_id: question.id,
        selected_option: timedOut ? null : selected,
        time_taken,
        timed_out: timedOut,
      })
      setAnswered((n) => n + 1)
      setSelected('')

      if (data.finished) {
        clearInterval(overallRef.current)
        navigate(`/result/${attemptId}`)
        return
      }
      if (data.question) {
        setQuestion(data.question)
      } else {
        clearInterval(overallRef.current)
        navigate(`/result/${attemptId}`)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit answer')
    } finally {
      setSubmitting(false)
      submittingRef.current = false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto p-8 text-center text-slate-500 dark:text-slate-400">
          Starting test...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const progress = (answered / maxQuestions) * 100
  const isCritical = secondsLeft <= 15
  const timerPct = (secondsLeft / timePerQ) * 100

  const overallCritical = overallLeft <= 5 * 60  // last 5 minutes
  const overallPct = (overallLeft / totalTime) * 100

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress + Timer row */}
        <div className="mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-2 gap-3 flex-wrap">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Question {answered + 1} of {maxQuestions}
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              {question && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full uppercase ${difficultyStyle[question.difficulty]}`}>
                  {question.difficulty}
                </span>
              )}
              {/* Per-question timer */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  isCritical
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 animate-pulse'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
                title="Time left for this question"
              >
                <span>⏱</span>
                <span className="tabular-nums">{secondsLeft}s</span>
              </div>
              {/* Overall test timer */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  overallCritical
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 animate-pulse'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }`}
                title="Total test time remaining (45 min)"
              >
                <span>🕒</span>
                <span className="tabular-nums">{formatMMSS(overallLeft)}</span>
              </div>
            </div>
          </div>

          {/* Question progress bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Per-question timer bar */}
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
            <div
              className={`h-full transition-all duration-1000 linear ${
                isCritical
                  ? 'bg-gradient-to-r from-rose-500 to-red-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${timerPct}%` }}
            />
          </div>

          {/* Overall timer bar */}
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 linear ${
                overallCritical
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        {question && (
          <div
            key={question.id}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-slide-up"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
              {question.text}
            </h2>

            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const text = question[`option_${opt.toLowerCase()}`]
                const isSelected = selected === opt
                return (
                  <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    disabled={submitting}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm flex-shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {opt}
                    </div>
                    <span className="text-slate-900 dark:text-slate-100">{text}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => submitAnswer(false)}
                disabled={!selected || submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition shadow-md"
              >
                {submitting ? 'Submitting...' : 'Submit Answer →'}
              </button>
            </div>

            {isCritical && (
              <p className="text-center text-sm text-rose-600 dark:text-rose-400 mt-4 font-medium animate-pulse">
                ⚠️ Hurry! Less than 15 seconds left on this question
              </p>
            )}
            {overallCritical && (
              <p className="text-center text-sm text-orange-600 dark:text-orange-400 mt-2 font-medium animate-pulse">
                ⏰ Only {formatMMSS(overallLeft)} left in the whole test
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
