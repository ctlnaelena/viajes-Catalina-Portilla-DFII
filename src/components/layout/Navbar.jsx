import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useViaje } from '../../context/ViajeContext.jsx'
import Logo from '../ui/Logo.jsx'

const enlaces = [
  { to: '/', texto: 'Inicio', end: true },
  { to: '/destinos', texto: 'Destinos' },
  { to: '/acerca', texto: 'Acerca' },
]

const claseEnlace = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-marca-50 text-marca-700' : 'text-slate-600 hover:bg-slate-100 hover:text-tinta'
  }`

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const { cantidad } = useViaje()
  const { pathname } = useLocation()

  // Cierra el menú móvil al navegar.
  useEffect(() => setAbierto(false), [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4" aria-label="Principal">
        <Link to="/" className="shrink-0" aria-label="TERRASEN, ir al inicio">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {enlaces.map((e) => (
            <li key={e.to}>
              <NavLink to={e.to} end={e.end} className={claseEnlace}>
                {e.texto}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <NavLink
            to="/mi-viaje"
            className={({ isActive }) =>
              `relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive ? 'bg-marca-700 text-white' : 'bg-tinta text-white hover:bg-slate-700'
              }`
            }
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
            <span>Mi viaje</span>
            {cantidad > 0 && (
              <span data-testid="contador-viaje" className="grid h-5 min-w-5 place-items-center rounded-full bg-acento px-1 text-xs text-tinta">
                {cantidad}
              </span>
            )}
          </NavLink>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-slate-100 md:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto((v) => !v)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {abierto ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {abierto && (
        <ul id="menu-movil" className="space-y-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {enlaces.map((e) => (
            <li key={e.to}>
              <NavLink to={e.to} end={e.end} className={(p) => `block ${claseEnlace(p)}`}>
                {e.texto}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
