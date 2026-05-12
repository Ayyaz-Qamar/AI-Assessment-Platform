import { useEffect, useState } from 'react'
import api from '../services/api'
import Navbar from '../components/Navbar'

export default function AdminPanel() {
  const [tab, setTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'tests', label: '📝 Tests' },
    { id: 'ai', label: '🤖 AI Questions' },
    { id: 'users', label: '👥 Users' },
    { id: 'ml', label: '🤖 ML Pipeline' },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage platform content, users, and ML pipeline
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition relative ${
                tab === t.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
              {tab === t.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {tab === 'overview' && <Overview />}
          {tab === 'tests' && <TestsManager />}
          {tab === 'ai' && <AIQuestionGenerator />}
          {tab === 'users' && <UsersList />}
          {tab === 'ml' && <MLPanel />}
        </div>
      </main>
    </div>
  )
}

// ============================================================
// OVERVIEW TAB
// ============================================================
function Overview() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/api/admin/stats').then((r) => setStats(r.data))
  }, [])

  if (!stats) return <div className="text-slate-500">Loading...</div>

  const cards = [
    { label: 'Total Users', value: stats.total_users, icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Students', value: stats.total_students, icon: '🎓', color: 'from-purple-500 to-pink-500' },
    { label: 'Tests', value: stats.total_tests, icon: '📝', color: 'from-emerald-500 to-teal-500' },
    { label: 'Questions', value: stats.total_questions, icon: '❓', color: 'from-amber-500 to-orange-500' },
    { label: 'Total Attempts', value: stats.total_attempts, icon: '✅', color: 'from-rose-500 to-pink-500' },
    { label: 'Avg Score', value: `${stats.avg_score.toFixed(1)}%`, icon: '⭐', color: 'from-indigo-500 to-purple-500' },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{c.value}</p>
              </div>
              <div className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${c.color} text-white`}>
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Level Distribution</h3>
        <div className="space-y-2">
          {Object.entries(stats.level_distribution).map(([lvl, count]) => (
            <div key={lvl} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="font-medium text-slate-900 dark:text-slate-100">{lvl}</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{count} attempts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// TESTS MANAGER
// ============================================================
function TestsManager() {
  const [tests, setTests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingTestId, setEditingTestId] = useState(null)

  const load = () => api.get('/api/tests/').then((r) => setTests(r.data))
  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    await api.post('/api/tests/', { title, description })
    setTitle(''); setDescription(''); setShowForm(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this test and all questions?')) return
    await api.delete(`/api/tests/${id}`)
    load()
  }

  if (editingTestId) {
    return <QuestionsManager testId={editingTestId} onBack={() => setEditingTestId(null)} />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manage Tests</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm"
        >
          {showForm ? 'Cancel' : '+ New Test'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 mb-4 space-y-3">
          <input
            type="text"
            required
            placeholder="Test title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Create Test
          </button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {tests.map((t) => (
          <div key={t.id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t.description || 'No description'}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {t.question_count} questions
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingTestId(t.id)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Manage Q&A
                </button>
                <button
                  onClick={() => remove(t.id)}
                  className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {tests.length === 0 && (
          <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-8">
            No tests yet. Create one to get started.
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// QUESTIONS MANAGER
// ============================================================
function QuestionsManager({ testId, onBack }) {
  const [test, setTest] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    text: '', option_a: '', option_b: '', option_c: '', option_d: '',
    correct_option: 'A', difficulty: 'medium',
  })

  const load = () => api.get(`/api/tests/${testId}`).then((r) => setTest(r.data))
  useEffect(() => { load() }, [testId])

  const submit = async (e) => {
    e.preventDefault()
    await api.post(`/api/tests/${testId}/questions`, form)
    setForm({
      text: '', option_a: '', option_b: '', option_c: '', option_d: '',
      correct_option: 'A', difficulty: 'medium',
    })
    setShowForm(false)
    load()
  }

  const remove = async (qid) => {
    if (!confirm('Delete this question?')) return
    await api.delete(`/api/tests/questions/${qid}`)
    load()
  }

  if (!test) return <div className="text-slate-500">Loading...</div>

  const diffStyle = {
    easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  }

  return (
    <div>
      <button onClick={onBack} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        ← Back to tests
      </button>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{test.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{test.questions?.length || 0} questions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm"
        >
          {showForm ? 'Cancel' : '+ Add Question'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 mb-4 space-y-3">
          <textarea
            required
            placeholder="Question text"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            {['a', 'b', 'c', 'd'].map((o) => (
              <input
                key={o}
                required
                placeholder={`Option ${o.toUpperCase()}`}
                value={form[`option_${o}`]}
                onChange={(e) => setForm({ ...form, [`option_${o}`]: e.target.value })}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.correct_option}
              onChange={(e) => setForm({ ...form, correct_option: e.target.value })}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="A">Correct: A</option>
              <option value="B">Correct: B</option>
              <option value="C">Correct: C</option>
              <option value="D">Correct: D</option>
            </select>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Add Question
          </button>
        </form>
      )}

      <div className="space-y-3">
        {(test.questions || []).map((q, i) => (
          <div key={q.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">#{i + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${diffStyle[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    Correct: {q.correct_option}
                  </span>
                </div>
                <p className="text-slate-900 dark:text-slate-100 font-medium mb-2">{q.text}</p>
                <div className="grid grid-cols-2 gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <div>A. {q.option_a}</div>
                  <div>B. {q.option_b}</div>
                  <div>C. {q.option_c}</div>
                  <div>D. {q.option_d}</div>
                </div>
              </div>
              <button
                onClick={() => remove(q.id)}
                className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {(test.questions || []).length === 0 && (
          <div className="text-center text-slate-500 dark:text-slate-400 py-8">
            No questions yet. Add some to enable adaptive testing.
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// USERS LIST
// ============================================================
function UsersList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/api/admin/users').then((r) => setUsers(r.data))
  }, [])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Role</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Attempts</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Avg Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{u.name}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.email}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  u.role === 'admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.total_attempts}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.avg_score.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">No users yet</div>
      )}
    </div>
  )
}

// ============================================================
// ML PANEL
// ============================================================
function MLPanel() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const run = async (label, fn) => {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fn()
      setMessage({ type: 'success', text: `${label}: ${JSON.stringify(res.data)}` })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || `${label} failed`,
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">🧠</div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">ML Pipeline</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Generate dataset from completed attempts and train RandomForest classifier
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <button
            disabled={busy}
            onClick={() => run('Dataset', () => api.post('/api/ml/generate-dataset'))}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            📥 Generate Dataset CSV
          </button>
          <button
            disabled={busy}
            onClick={() => run('Train', () => api.post('/api/ml/train'))}
            className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            🚀 Train Model
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm break-words ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How it works</h4>
        <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
          <li>Generate Dataset → Exports completed attempts to <code>app/ml/dataset.csv</code></li>
          <li>Train Model → Uses features (accuracy, avg_difficulty, attempt_time) to predict competency_level</li>
          <li>Predictions auto-attached to every new attempt</li>
          <li>Minimum 5 completed attempts needed to train the model</li>
        </ol>
      </div>
    </div>
  )
}

// ============================================================
// AI QUESTION GENERATOR (NEW)
// ============================================================
function AIQuestionGenerator() {
  const [tests, setTests] = useState([])
  const [testId, setTestId] = useState('')
  const [topicHint, setTopicHint] = useState('')
  const [count, setCount] = useState(10)
  const [diffMix, setDiffMix] = useState({ easy: true, medium: true, hard: true })
  const [generated, setGenerated] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/api/tests/').then((r) => {
      setTests(r.data)
      if (r.data.length > 0) setTestId(r.data[0].id)
    })
    api.get('/api/ai-questions/health').then((r) => setInfo(r.data)).catch(() => {})
  }, [])

  const generate = async () => {
    setError('')
    setGenerated(null)
    const mix = Object.entries(diffMix).filter(([, v]) => v).map(([k]) => k)
    if (mix.length === 0) {
      setError('Pick at least one difficulty')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/api/ai-questions/generate', {
        test_id: parseInt(testId),
        count,
        topic_hint: topicHint || null,
        difficulty_mix: mix,
      })
      // Each question gets a local id for editing
      data.questions = data.questions.map((q, i) => ({ ...q, _localId: i, _keep: true }))
      setGenerated(data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleKeep = (id) => {
    setGenerated((g) => ({
      ...g,
      questions: g.questions.map((q) => (q._localId === id ? { ...q, _keep: !q._keep } : q)),
    }))
  }

  const updateField = (id, field, val) => {
    setGenerated((g) => ({
      ...g,
      questions: g.questions.map((q) => (q._localId === id ? { ...q, [field]: val } : q)),
    }))
  }

  const approve = async () => {
    if (!generated) return
    const toSave = generated.questions
      .filter((q) => q._keep)
      .map(({ _localId, _keep, ...rest }) => rest)

    if (toSave.length === 0) {
      setError('Nothing selected to save')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { data } = await api.post('/api/ai-questions/approve', {
        test_id: generated.test_id,
        questions: toSave,
      })
      alert(`✅ Saved ${data.saved} questions! Skipped: ${data.skipped}`)
      setGenerated(null)
      setTopicHint('')
    } catch (e) {
      setError(e.response?.data?.detail || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!generated) {
    return (
      <div className="space-y-4">
        {info && !info.configured && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4 text-amber-800 dark:text-amber-300">
            ⚠️ {info.detail || 'AI provider not configured. Add GEMINI_API_KEY to backend .env'}
          </div>
        )}

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                AI Question Generator
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate exam-quality multiple-choice questions using Google Gemini
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Test
            </label>
            <select
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.question_count} existing questions)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Topic Hint (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Binary trees, sorting algorithms, OOP"
              value={topicHint}
              onChange={(e) => setTopicHint(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Leave blank for a balanced mix of typical subject topics.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              How many questions?
            </label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n} questions</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Difficulty Mix
            </label>
            <div className="flex gap-3 flex-wrap">
              {['easy', 'medium', 'hard'].map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={diffMix[d]}
                    onChange={(e) => setDiffMix({ ...diffMix, [d]: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="capitalize text-sm text-slate-700 dark:text-slate-300">{d}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading || !testId}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition shadow-md"
          >
            {loading ? '⏳ Generating... (this may take 30-60s)' : '🚀 Generate Questions'}
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>How it works:</strong> Gemini generates fresh questions following strict quality rules. They're then de-duplicated against existing questions, validated, and the correct-answer position is randomized to A/B/C/D. You review before saving.
          </p>
        </div>
      </div>
    )
  }

  // Preview screen
  const kept = generated.questions.filter((q) => q._keep).length
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-300 dark:border-emerald-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          ✨ {generated.generated} questions generated!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Review below. Uncheck any you don't want, edit text if needed, then approve.
        </p>
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mt-2">
          Selected to save: {kept} / {generated.questions.length}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={approve}
          disabled={saving || kept === 0}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium disabled:opacity-50 hover:opacity-90 transition shadow-md"
        >
          {saving ? 'Saving...' : `✅ Approve & Save ${kept} Questions`}
        </button>
        <button
          onClick={() => setGenerated(null)}
          className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
        >
          ❌ Discard All
        </button>
      </div>

      <div className="space-y-3">
        {generated.questions.map((q, idx) => {
          const diffColor =
            q.difficulty === 'easy'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              : q.difficulty === 'hard'
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
          return (
            <div
              key={q._localId}
              className={`bg-white dark:bg-slate-900 rounded-xl p-4 border-2 transition ${
                q._keep ? 'border-emerald-300 dark:border-emerald-700' : 'border-slate-200 dark:border-slate-800 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={q._keep}
                    onChange={() => toggleKeep(q._localId)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    Q{idx + 1}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${diffColor}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Correct: {q.correct_option}
                  </span>
                </div>
              </div>
              <textarea
                value={q.text}
                onChange={(e) => updateField(q._localId, 'text', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm mb-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid sm:grid-cols-2 gap-2">
                {['a', 'b', 'c', 'd'].map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      q.correct_option === opt.toUpperCase()
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {opt.toUpperCase()}
                    </span>
                    <input
                      type="text"
                      value={q[`option_${opt}`]}
                      onChange={(e) => updateField(q._localId, `option_${opt}`, e.target.value)}
                      className="flex-1 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
