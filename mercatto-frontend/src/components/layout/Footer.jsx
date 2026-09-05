import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      {/* Features bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Truck size={24} className="text-indigo-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Envíos a todo el país</h4>
              <p className="text-[11px] text-slate-400">Gratis desde $150.000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Compra 100% Segura</h4>
              <p className="text-[11px] text-slate-400">Pasarela cifrada y protegida</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw size={24} className="text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Garantía y Devolución</h4>
              <p className="text-[11px] text-slate-400">Soporte directo con vendedores</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headphones size={24} className="text-sky-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Soporte y Negociación</h4>
              <p className="text-[11px] text-slate-400">Habla directo con el proveedor</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="text-xl font-black text-white tracking-tight">MERCATTO</span>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              La plataforma que une compradores y proveedores directamente. Compra con seguridad y comunícate sin intermediarios.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Comprar</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalogo" className="hover:text-white">Explorar Catálogo</Link></li>
              <li><Link to="/catalogo?orden=ofertas" className="hover:text-white">Ofertas Especiales</Link></li>
              <li><Link to="/favoritos" className="hover:text-white">Lista de Deseos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Vendedores</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/registro?rol=VENDEDOR" className="hover:text-white">Crear Tienda Virtual</Link></li>
              <li><Link to="/vendedor" className="hover:text-white">Panel de Vendedor</Link></li>
              <li><Link to="/login" className="hover:text-white">Acceso Proveedores</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Soporte</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400">soporte@mercatto.com</span></li>
              <li><span className="text-slate-400">+57 (300) 123-4567</span></li>
              <li><span className="text-slate-400">Lunes a Sábado: 8am - 6pm</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Mercatto Marketplace. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
