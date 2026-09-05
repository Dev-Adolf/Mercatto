import api from './api'

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  registro: async (datos) => {
    const res = await api.post('/auth/registro', datos)
    return res.data
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('mercatto_token')
      localStorage.removeItem('mercatto_refresh_token')
      localStorage.removeItem('mercatto_user')
    }
  },

  getMe: async () => {
    const res = await api.get('/auth/me')
    return res.data
  },
}

export default authService
