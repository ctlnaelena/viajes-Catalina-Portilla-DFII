import { Link } from 'react-router-dom'
import Logo from '../ui/Logo.jsx'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo pequeno />
        </div>
        <div className="flex gap-4">
          <Link className="hover:text-tinta" to="/destinos">Destinos</Link>
          <Link className="hover:text-tinta" to="/acerca">Cómo funciona</Link>
        </div>
      </div>
    </footer>
  )
}
