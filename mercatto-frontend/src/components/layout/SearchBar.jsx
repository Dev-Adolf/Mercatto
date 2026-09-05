import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export const SearchBar = ({ className = '' }) => {
  const [termino, setTermino] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (termino.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(termino.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative w-full ${className}`}>
      <input
        type="text"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Buscar productos, marcas y más..."
        className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
      />
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={18} />
      </div>
    </form>
  )
}

export default SearchBar
