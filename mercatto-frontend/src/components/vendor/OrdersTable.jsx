import React, { useState } from 'react'
import { formatCurrency } from '../../utils/formatCurrency'
import { ESTADOS_PEDIDO } from '../../utils/constants'
import Button from '../common/Button'
import Modal from '../common/Modal'
import Input from '../common/Input'
import pedidoService from '../../services/pedidoService'
import { useToast } from '../../hooks/useToast'
import { Eye, Truck } from 'lucide-react'

export const OrdersTable = ({ pedidos = [], onPedidoActualizado }) => {
  const [pedidoDetalle, setPedidoDetalle] = useState(null)
  const [modalEnvio, setModalEnvio] = useState(null)
  const [guia, setGuia] = useState('')
  const [empresa, setEmpresa] = useState('Servientrega')
  const [loading, setLoading] = useState(false)
  const { success, error } = useToast()

  const handleActualizarEstado = async (id, estado, tracking = null, carrier = null) => {
    try {
      await pedidoService.actualizarEstado(id, { estado, guia: tracking, empresa: carrier })
      success('Estado del pedido actualizado')
      if (onPedidoActualizado) onPedidoActualizado()
    } catch {
      error('Error al actualizar estado')
    }
  }

  const handleEnviarPedido = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await handleActualizarEstado(modalEnvio.id, 'ENVIADO', guia, empresa)
      setModalEnvio(null)
      setGuia('')
    } finally {
      setLoading(false)
    }
  }

  if (pedidos.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
        Aún no has recibido pedidos en tu tienda.
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3.5">Código</th>
              <th className="p-3.5">Cliente</th>
              <th className="p-3.5">Total</th>
              <th className="p-3.5">Estado</th>
              <th className="p-3.5">Fecha</th>
              <th className="p-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pedidos.map((p) => {
              const infoEstado = ESTADOS_PEDIDO[p.estado] || { label: p.estado, color: 'gray' }
              return (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{p.codigo}</td>
                  <td className="p-3.5">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{p.comprador?.nombre}</p>
                    <p className="text-[11px] text-slate-400">{p.direccion?.ciudad}</p>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{formatCurrency(p.total)}</td>
                  <td className="p-3.5">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {infoEstado.label}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString('es-CO') : '-'}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => setPedidoDetalle(p)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Ver Detalles"
                    >
                      <Eye size={15} />
                    </button>

                    {p.estado === 'PAGADO' && (
                      <button
                        onClick={() => handleActualizarEstado(p.id, 'EN_PREPARACION')}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-bold hover:bg-indigo-100 cursor-pointer"
                      >
                        Preparar
                      </button>
                    )}

                    {p.estado === 'EN_PREPARACION' && (
                      <button
                        onClick={() => setModalEnvio(p)}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 text-[11px] font-bold hover:bg-purple-100 cursor-pointer"
                      >
                        Despachar
                      </button>
                    )}

                    {p.estado === 'ENVIADO' && (
                      <button
                        onClick={() => handleActualizarEstado(p.id, 'ENTREGADO')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold hover:bg-emerald-100 cursor-pointer"
                      >
                        Marcar Entregado
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Detalle Pedido */}
      {pedidoDetalle && (
        <Modal isOpen={true} onClose={() => setPedidoDetalle(null)} title={`Detalles de Pedido: ${pedidoDetalle.codigo}`}>
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1">
              <p className="font-bold text-slate-800 dark:text-white">Dirección de Envío:</p>
              <p className="text-slate-600 dark:text-slate-300">
                {pedidoDetalle.direccion?.nombreCompleto} — Tel: {pedidoDetalle.direccion?.telefono}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {pedidoDetalle.direccion?.direccion}, {pedidoDetalle.direccion?.ciudad}, {pedidoDetalle.direccion?.departamento}
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pedidoDetalle.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 items-center">
                  <div className="flex items-center gap-2">
                    <img src={item.imagenUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'} className="w-8 h-8 rounded object-cover" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{item.nombreProducto}</p>
                      {item.nombreVariante && <p className="text-[10px] text-slate-400">{item.nombreVariante}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.cantidad} x {formatCurrency(item.precioUnitario)}</p>
                    <p className="font-bold text-indigo-600">{formatCurrency(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t flex justify-between font-bold text-sm">
              <span>Total Pedido:</span>
              <span className="text-indigo-600">{formatCurrency(pedidoDetalle.total)}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Despachar Pedido */}
      {modalEnvio && (
        <Modal isOpen={true} onClose={() => setModalEnvio(null)} title="Registrar Despacho de Pedido">
          <form onSubmit={handleEnviarPedido} className="space-y-4">
            <Input
              label="Empresa de Transporte / Encomienda"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Ej: Servientrega, Coordinadora, Interrapidísimo"
              required
            />
            <Input
              label="Número de Guía / Tracking"
              value={guia}
              onChange={(e) => setGuia(e.target.value)}
              placeholder="Ej: 1234567890"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalEnvio(null)}>Cancelar</Button>
              <Button type="submit" variant="primary" loading={loading}>Confirmar Envío</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default OrdersTable
