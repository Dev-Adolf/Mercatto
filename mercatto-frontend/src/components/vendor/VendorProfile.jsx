import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import vendedorService from '../../services/vendedorService'
import { useToast } from '../../hooks/useToast'

export const VendorProfile = ({ perfil, onPerfilActualizado }) => {
  const [nombreTienda, setNombreTienda] = useState(perfil?.nombreTienda || '')
  const [descripcion, setDescripcion] = useState(perfil?.descripcion || '')
  const [logoUrl, setLogoUrl] = useState(perfil?.logoUrl || '')
  const [ciudad, setCiudad] = useState(perfil?.ciudad || '')
  const [direccion, setDireccion] = useState(perfil?.direccion || '')
  const [cuentaBancaria, setCuentaBancaria] = useState(perfil?.cuentaBancaria || '')
  const [banco, setBanco] = useState(perfil?.banco || '')
  const [loading, setLoading] = useState(false)
  const { success, error } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await vendedorService.actualizarPerfil({
        nombreTienda,
        descripcion,
        logoUrl,
        ciudad,
        direccion,
        cuentaBancaria,
        banco,
      })
      success('Perfil de tienda actualizado')
      if (onPerfilActualizado) onPerfilActualizado()
    } catch {
      error('Error al actualizar datos de la tienda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">Datos de tu Tienda / Negocio</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre Comercial de la Tienda"
          value={nombreTienda}
          onChange={(e) => setNombreTienda(e.target.value)}
          required
        />
        <Input
          label="Logo o Imagen de Marca (URL)"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Descripción de la Tienda
        </label>
        <textarea
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Cuenta a los clientes sobre tu experiencia, tipo de productos y garantía..."
          className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
        <Input
          label="Dirección Física de Despacho"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Input
          label="Banco para Transferencias / Pagos"
          value={banco}
          onChange={(e) => setBanco(e.target.value)}
          placeholder="Ej: Bancolombia, Davivienda, Nequi"
        />
        <Input
          label="Número de Cuenta / Celular"
          value={cuentaBancaria}
          onChange={(e) => setCuentaBancaria(e.target.value)}
          placeholder="Ej: 123-456789-00"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={loading}>
          Guardar Cambios de Tienda
        </Button>
      </div>
    </form>
  )
}

export default VendorProfile
