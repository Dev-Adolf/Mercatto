import React from 'react'
import { METODOS_PAGO } from '../../utils/constants'
import { CreditCard, Building, Smartphone, CheckCircle } from 'lucide-react'

export const PaymentForm = ({ metodoSeleccionado, onSelectMetodo }) => {
  const getIcon = (id) => {
    switch (id) {
      case 'STRIPE':
        return <CreditCard className="text-indigo-600" size={20} />
      case 'PSE':
        return <Building className="text-emerald-600" size={20} />
      case 'NEQUI':
        return <Smartphone className="text-purple-600" size={20} />
      default:
        return <CreditCard size={20} />
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {METODOS_PAGO.map((m) => {
          const isSelected = metodoSeleccionado === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMetodo(m.id)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {getIcon(m.id)}
                {isSelected && <CheckCircle size={16} className="text-indigo-600" />}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{m.nombre}</span>
            </button>
          )
        })}
      </div>

      {metodoSeleccionado === 'STRIPE' && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            Procesamiento seguro con cifrado bancario de 256 bits (Stripe).
          </p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Número de Tarjeta (4242 ...)"
              className="col-span-2 p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
            <input
              type="text"
              placeholder="MM/AA"
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
            <input
              type="text"
              placeholder="CVC"
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
        </div>
      )}

      {(metodoSeleccionado === 'PSE' || metodoSeleccionado === 'NEQUI') && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
          <p className="font-bold text-purple-900 dark:text-purple-300">
            Transferencia en línea inmediata ({metodoSeleccionado})
          </p>
          <p className="text-purple-700 dark:text-purple-400">
            Al hacer clic en pagar se generará el código de referencia para tu pago desde la aplicación de tu banco o billetera móvil.
          </p>
        </div>
      )}
    </div>
  )
}

export default PaymentForm
