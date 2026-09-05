import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import productoService from '../../services/productoService'
import PriceDisplay from './PriceDisplay'
import StarRating from '../common/StarRating'
import { ShoppingBag, Heart, Store, MessageSquare } from 'lucide-react'

export const ProductCard = ({ producto, onContactClick }) => {
  const { agregarItem } = useCart()
  const { autenticado } = useAuth()
  const { success, info } = useToast()
  const [esFavorito, setEsFavorito] = useState(false)
  const navigate = useNavigate()

  const imagenPrincipal =
    producto.imagenes?.find((img) => img.principal)?.url ||
    producto.imagenes?.[0]?.url ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'

  const handleToggleFavorito = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!autenticado) {
      info('Inicia sesión para guardar en favoritos')
      navigate('/login')
      return
    }
    try {
      const res = await productoService.toggleFavorito(producto.id)
      setEsFavorito(res.favorito)
      success(res.mensaje)
    } catch {
      // Error manejado
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    agregarItem(producto, null, 1)
  }

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorito}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:scale-110 transition shadow cursor-pointer"
        title="Guardar en favoritos"
      >
        <Heart size={16} className={esFavorito ? 'text-rose-500 fill-rose-500' : ''} />
      </button>

      {/* Image container */}
      <Link to={`/producto/${producto.id}`} className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
        <img
          src={imagenPrincipal}
          alt={producto.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {producto.destacado && (
          <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
            Destacado
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Vendor Name */}
          {producto.vendedor && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Store size={12} className="text-indigo-500" />
              <span className="truncate">{producto.vendedor.nombreTienda}</span>
            </div>
          )}

          {/* Title */}
          <Link to={`/producto/${producto.id}`}>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-indigo-600 transition" title={producto.titulo}>
              {producto.titulo}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={producto.calificacion || 0} size={13} />
            <span className="text-xs text-slate-400 font-medium">
              ({producto.totalResenas || 0})
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <PriceDisplay
            precio={producto.precio}
            precioOferta={producto.precioOferta}
            size="md"
          />

          <div className="flex items-center gap-1.5">
            {onContactClick && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onContactClick(producto)
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                title="Consultar al proveedor"
              >
                <MessageSquare size={16} />
              </button>
            )}

            <button
              onClick={handleAddToCart}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow hover:shadow-indigo-500/25 transition cursor-pointer"
              title="Añadir al Carrito"
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
