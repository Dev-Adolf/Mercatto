import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    try {
      const u = localStorage.getItem('mercatto_user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('mercatto_token') || null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const verificarSesion = async () => {
      const storedToken = localStorage.getItem('mercatto_token')
      if (storedToken) {
        try {
          const me = await authService.getMe()
          if (me?.exito) {
            setUsuario((prev) => ({
              ...prev,
              email: me.email,
              rol: me.rol?.replace('ROLE_', ''),
            }))
          }
        } catch {
          // Token inválido
        }
      }
      setCargando(false)
    }
    verificarSesion()
  }, [])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    if (res?.exito && res?.accessToken) {
      localStorage.setItem('mercatto_token', res.accessToken)
      if (res.refreshToken) localStorage.setItem('mercatto_refresh_token', res.refreshToken)
      localStorage.setItem('mercatto_user', JSON.stringify(res.usuario))
      setToken(res.accessToken)
      setUsuario(res.usuario)
      return { exito: true, usuario: res.usuario }
    }
    return { exito: false, mensaje: res?.mensaje || 'Error al iniciar sesión', pendiente: res?.pendiente }
  }

  const registro = async (datos) => {
    const res = await authService.registro(datos)
    if (res?.exito && res?.accessToken) {
      localStorage.setItem('mercatto_token', res.accessToken)
      if (res.refreshToken) localStorage.setItem('mercatto_refresh_token', res.refreshToken)
      localStorage.setItem('mercatto_user', JSON.stringify(res.usuario))
      setToken(res.accessToken)
      setUsuario(res.usuario)
      return { exito: true, usuario: res.usuario }
    }
    return {
      exito: res?.exito || false,
      mensaje: res?.mensaje || 'Error en el registro',
      pendiente: res?.pendiente || false,
    }
  }

  const logout = async () => {
    await authService.logout()
    setToken(null)
    setUsuario(null)
  }

  const esComprador = usuario?.rol === 'COMPRADOR'
  const esVendedor = usuario?.rol === 'VENDEDOR'
  const esAdmin = usuario?.rol === 'ADMIN'

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        cargando,
        autenticado: !!token && !!usuario,
        esComprador,
        esVendedor,
        esAdmin,
        login,
        registro,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
