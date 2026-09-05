import api from './api'

export const adminService = {
  obtenerEstadisticas: async () => {
    const res = await api.get('/admin/stats')
    return res.data
  },

  listarVendedores: async (params = {}) => {
    const res = await api.get('/admin/vendedores', { params })
    return res.data
  },

  cambiarEstadoVendedor: async (id, estado) => {
    const res = await api.patch(`/admin/vendedores/${id}/estado`, { estado })
    return res.data
  },

  listarUsuarios: async (params = {}) => {
    const res = await api.get('/admin/usuarios', { params })
    return res.data
  },

  cambiarEstadoUsuario: async (id, activo) => {
    const res = await api.patch(`/admin/usuarios/${id}/estado`, { activo })
    return res.data
  },

  crearCategoria: async (datos, padreId = null) => {
    const res = await api.post('/categorias', datos, { params: { padreId } })
    return res.data
  },

  actualizarCategoria: async (id, datos, padreId = null) => {
    const res = await api.put(`/categorias/${id}`, datos, { params: { padreId } })
    return res.data
  },

  eliminarCategoria: async (id) => {
    const res = await api.delete(`/categorias/${id}`)
    return res.data
  },

  listarCupones: async () => {
    const res = await api.get('/cupones')
    return res.data
  },

  crearCupon: async (datos) => {
    const res = await api.post('/cupones', datos)
    return res.data
  },

  eliminarCupon: async (id) => {
    const res = await api.delete(`/cupones/${id}`)
    return res.data
  },

  listarReportes: async (params = {}) => {
    const res = await api.get('/reportes', { params })
    return res.data
  },

  actualizarReporte: async (id, datos) => {
    const res = await api.patch(`/reportes/${id}`, datos)
    return res.data
  },
}

export default adminService
