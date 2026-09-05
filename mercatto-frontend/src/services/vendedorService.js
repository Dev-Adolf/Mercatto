import api from './api'

export const vendedorService = {
  obtenerPerfil: async () => {
    const res = await api.get('/vendedor/perfil')
    return res.data
  },

  actualizarPerfil: async (datos) => {
    const res = await api.put('/vendedor/perfil', datos)
    return res.data
  },

  obtenerEstadisticas: async () => {
    const res = await api.get('/vendedor/stats')
    return res.data
  },

  bandejaMensajes: async (params = {}) => {
    const res = await api.get('/mensajes/bandeja-vendedor', { params })
    return res.data
  },

  marcarMensajeLeido: async (id) => {
    const res = await api.patch(`/mensajes/${id}/leido`)
    return res.data
  },
}

export default vendedorService
