import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDestinos } from '../hooks/useDestinos.js'
import GrillaDestinos from '../components/destinos/GrillaDestinos.jsx'

const pasos = [
  { n: '1', titulo: 'Elige un destino', texto: 'Explora ciudades y sus actividades más populares.' },
  { n: '2', titulo: 'Compara opciones', texto: 'Revisa vuelos y hoteles con precios, fechas y cupos.' },
  { n: '3', titulo: 'Arma tu plan', texto: 'Combina vuelo + hotel y mira el total estimado.' },
]

export default function Inicio() {
  const [busqueda, setBusqueda] = useState('')
  const navegar = useNavigate()
  const { destinos, loading, error, reintentar } = useDestinos()

  const buscar = (e) => {
    e.preventDefault()
    navegar(busqueda.trim() ? `/destinos?q=${encodeURIComponent(busqueda.trim())}` : '/destinos')
  }

  return (
    <>
      <section className="relative overflow-hidden bg-marca-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, #14b8a6 0, transparent 40%), radial-gradient(circle at 85% 30%, #f59e0b 0, transparent 35%), radial-gradient(circle at 60% 100%, #0ea5e9 0, transparent 45%)' }} />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-marca-100">Agencia de viajes</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Tu próximo viaje empieza aquí.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-marca-100">
            Descubre destinos, compara vuelos y hoteles en un solo lugar y arma tu plan en minutos.
          </p>
          <form onSubmit={buscar} className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row" role="search">
            <label htmlFor="busqueda-inicio" className="sr-only">¿A dónde quieres ir?</label>
            <input
              id="busqueda-inicio"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="¿A dónde quieres ir?"
              className="min-w-0 flex-1 rounded-xl px-4 py-3 text-tinta outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="rounded-xl bg-acento px-6 py-3 font-bold text-tinta hover:bg-amber-400">
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Destinos destacados</h2>
            <p className="mt-1 text-slate-600">Los favoritos de nuestros viajeros esta temporada.</p>
          </div>
          <Link to="/destinos" className="hidden shrink-0 font-semibold text-marca-700 hover:underline sm:block">Ver todos →</Link>
        </div>
        <div className="mt-8">
          <GrillaDestinos destinos={destinos.slice(0, 6)} loading={loading} error={error} onReintentar={reintentar} />
        </div>
        <Link to="/destinos" className="mt-6 block text-center font-semibold text-marca-700 sm:hidden">Ver todos los destinos →</Link>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Así de simple</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {pasos.map((p) => (
            <li key={p.n} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-marca-50 font-extrabold text-marca-700">{p.n}</span>
              <h3 className="mt-4 font-bold">{p.titulo}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
