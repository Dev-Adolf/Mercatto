export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const ROLES = {
  COMPRADOR: 'COMPRADOR',
  VENDEDOR: 'VENDEDOR',
  ADMIN: 'ADMIN',
}

export const ESTADOS_PEDIDO = {
  PENDIENTE: { label: 'Pendiente de Pago', color: 'yellow' },
  PAGADO: { label: 'Pagado / Confirmado', color: 'blue' },
  EN_PREPARACION: { label: 'En Preparación', color: 'indigo' },
  ENVIADO: { label: 'En Camino', color: 'purple' },
  ENTREGADO: { label: 'Entregado', color: 'green' },
  CANCELADO: { label: 'Cancelado', color: 'red' },
  REEMBOLSADO: { label: 'Reembolsado', color: 'gray' },
}

export const METODOS_PAGO = [
  { id: 'STRIPE', nombre: 'Tarjeta de Crédito / Débito', icono: 'CreditCard' },
  { id: 'PSE', nombre: 'PSE / Transferencia Bancaria', icono: 'Building' },
  { id: 'NEQUI', nombre: 'Nequi / Daviplata', icono: 'Smartphone' },
]
