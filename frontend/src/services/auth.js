import api from './api'

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login-json', { email, password })
  localStorage.setItem('token', data.access_token)
  // Fetch full user profile after login
  const me = await api.get('/api/auth/me')
  localStorage.setItem('user', JSON.stringify(me.data))
  return me.data
}

export async function register(name, email, password, role = 'student') {
  const { data } = await api.post('/api/auth/register', { name, email, password, role })
  return data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getUser() {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}

export function isAdmin() {
  const u = getUser()
  return u?.role === 'admin'
}
