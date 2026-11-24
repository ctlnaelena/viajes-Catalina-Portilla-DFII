import { Link } from 'react-router-dom'

export default function NoEncontrado({ mensaje = 'La página que buscas no existe o fue movida.' }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-marca-700">404</p>
      <h1 className="mt-4 text-2xl font-bold">Te saliste del mapa</h1>
      <p className="mt-2 text-slate-600">{mensaje}</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-tinta px-6 py-3 font-semibold text-white">Volver al inicio</Link>
    </div>
  )
}
