import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import productoService from '../services/productoService'
import ProductGrid from '../components/product/ProductGrid'
import ModalContactoVendedor from '../components/product/ModalContactoVendedor'
import Button from '../components/common/Button'
import { ArrowRight, Sparkles, Store, ShieldCheck, Zap, Grid } from 'lucide-react'

export const Home = () => {
  const [destacados, setDestacados] = useState([])
  const [nuevos, setNuevos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [productoContacto, setProductoContacto] = useState(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dest, nuev, cats] = await Promise.all([
          productoService.obtenerDestacados(),
          productoService.obtenerNuevos(),
          productoService.listarCategorias(),
        ])
        setDestacados(dest || [])
        setNuevos(nuev || [])
        setCategorias(cats || [])
      } catch {
        // Fallback datos vacíos
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
            <Zap size={14} /> El Marketplace de Compradores y Proveedores
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Descubre miles de productos directo del fabricante y vendedor.
          </h1>
          <p className="text-sm sm:text-base text-indigo-200 leading-relaxed max-w-lg">
            Compra seguro con pasarela de pagos integrada y contacta directamente con cada proveedor para aclarar dudas o negociar.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/catalogo">
              <Button variant="secondary" size="lg" className="font-bold">
                <span>Explorar Catálogo</span>
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/registro?rol=VENDEDOR">
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                <Store size={18} className="mr-2" />
                <span>Crear Tienda como Proveedor</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías Principales */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Categorías Populares
            </h2>
            <p className="text-xs text-slate-500 mt-1">Explora los departamentos más buscados</p>
          </div>
          <Link to="/catalogo" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
            <span>Ver todas</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categorias.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo?categoriaId=${cat.id}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Grid size={22} />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition truncate w-full">
                {cat.nombre}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Productos Destacados
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Los artículos más vendidos y mejor valorados</p>
          </div>
          <Link to="/catalogo?orden=calificacion" className="text-xs font-bold text-indigo-600 hover:underline">
            Ver más destacados →
          </Link>
        </div>

        <ProductGrid
          productos={destacados}
          loading={loading}
          onContactClick={(prod) => setProductoContacto(prod)}
        />
      </section>

      {/* Banner de Valor para Proveedores */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl font-black">¿Tienes productos o eres proveedor mayorista?</h3>
          <p className="text-xs font-medium text-slate-900/80 leading-relaxed">
            Publica tus productos en Mercatto y accede a miles de compradores sin costos fijos de entrada. Gestiona inventario, pedidos y habla directamente con tus clientes.
          </p>
        </div>
        <Link to="/registro?rol=VENDEDOR">
          <Button variant="primary" size="lg" className="bg-slate-950 text-white hover:bg-slate-900 font-bold shrink-0">
            Comenzar a Vender Ahora
          </Button>
        </Link>
      </section>

      {/* Novedades y Recientes */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Recién Llegados
            </h2>
            <p className="text-xs text-slate-500 mt-1">Últimas publicaciones añadidas por proveedores</p>
          </div>
          <Link to="/catalogo?orden=recientes" className="text-xs font-bold text-indigo-600 hover:underline">
            Ver todo el catálogo →
          </Link>
        </div>

        <ProductGrid
          productos={nuevos}
          loading={loading}
          onContactClick={(prod) => setProductoContacto(prod)}
        />
      </section>

      {/* Modal Contacto Vendedor */}
      {productoContacto && (
        <ModalContactoVendedor
          isOpen={true}
          producto={productoContacto}
          onClose={() => setProductoContacto(null)}
        />
      )}
    </div>
  )
}

export default Home
