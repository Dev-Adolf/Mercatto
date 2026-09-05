import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import SearchBar from './SearchBar'
import CategoryMenu from './CategoryMenu'
import { ShoppingBag, Heart, User, LogOut, Store, Shield, Package, Menu, X } from 'lucide-react'

export const Navbar = () => {
  const { usuario, autenticado, logout, esVendedor, esAdmin } = useAuth()
  const { totalItems, setDrawerAbierto } = useCart()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [dropdownUser, setDropdownUser] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setDropdownUser(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Category */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-indigo-700 dark:text-indigo-400">
                MERCATTO
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                Marketplace
              </span>
            </Link>

            <div className="hidden lg:block">
              <CategoryMenu />
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <SearchBar />
          </div>

          {/* Action Links & Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!esVendedor && !esAdmin && (
              <Link
                to="/registro?rol=VENDEDOR"
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 transition"
              >
                <Store size={15} />
                <span>Vende tus productos</span>
              </Link>
            )}

            {/* Favoritos */}
            {autenticado && (
              <Link
                to="/favoritos"
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                title="Mis Favoritos"
              >
                <Heart size={20} />
              </Link>
            )}

            {/* Carrito */}
            <button
              onClick={() => setDrawerAbierto(true)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer"
              title="Carrito de Compras"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Dropdown / Login */}
            {autenticado ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownUser(!dropdownUser)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {usuario?.nombre}
                  </span>
                </button>

                {dropdownUser && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-medium text-slate-400">Conectado como</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{usuario?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                        {usuario?.rol}
                      </span>
                    </div>

                    <Link
                      to="/mis-pedidos"
                      onClick={() => setDropdownUser(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Package size={16} className="text-slate-400" />
                      <span>Mis Pedidos</span>
                    </Link>

                    {esVendedor && (
                      <Link
                        to="/vendedor"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800"
                      >
                        <Store size={16} />
                        <span>Panel de Vendedor</span>
                      </Link>
                    )}

                    {esAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownUser(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                      >
                        <Shield size={16} />
                        <span>Panel de Administración</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition"
                >
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {menuAbierto && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <SearchBar className="mb-4" />
            <div className="flex flex-col gap-2">
              <Link
                to="/catalogo"
                onClick={() => setMenuAbierto(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              >
                Catálogo Completo
              </Link>
              {!esVendedor && !esAdmin && (
                <Link
                  to="/registro?rol=VENDEDOR"
                  onClick={() => setMenuAbierto(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Vender en Mercatto
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
