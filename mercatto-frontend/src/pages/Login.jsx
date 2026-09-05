import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { Mail, Lock, LogIn } from 'lucide-react'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await login(email.trim(), password)
    setLoading(false)

    if (res?.exito) {
      success('¡Bienvenido de vuelta a Mercatto!')
      if (res.usuario?.rol === 'VENDEDOR') {
        navigate('/vendedor')
      } else if (res.usuario?.rol === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate(redirectUrl)
      }
    } else {
      error(res?.mensaje || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-2xl font-black text-indigo-600">MERCATTO</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Iniciar Sesión</h2>
          <p className="text-xs text-slate-500">Ingresa con tu correo y contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu@correo.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full font-bold" loading={loading}>
            <LogIn size={18} className="mr-2" />
            <span>Ingresar</span>
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          ¿No tienes una cuenta aún?{' '}
          <Link to="/registro" className="font-bold text-indigo-600 hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
