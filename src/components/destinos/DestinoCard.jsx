import { Link } from 'react-router-dom'
import Portada from './Portada.jsx'
import Etiqueta from '../ui/Etiqueta.jsx'

export default function DestinoCard({ destino }) {
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-within:shadow-lg">
      <Portada destino={destino} className="h-36">
        <div className="absolute bottom-3 left-4">
          <Etiqueta tono="oscuro">{destino.continente}</Etiqueta>
        </div>
      </Portada>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-marca-700">{destino.pais}</p>
        <h3 className="mt-1 text-xl font-bold">
          {/* El enlace "estira" su área a toda la tarjeta */}
          <Link to={`/destinos/${destino.id}`} className="after:absolute after:inset-0 focus:outline-none">
            <span className="relative">{destino.nombre}</span>
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{destino.descripcion}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Actividades populares">
          {destino.actividades.slice(0, 3).map((a) => (
            <li key={a}><Etiqueta>{a}</Etiqueta></li>
          ))}
        </ul>
        <span className="mt-auto pt-5 text-sm font-semibold text-marca-700 group-hover:underline">
          Ver vuelos y hoteles →
        </span>
      </div>
    </article>
  )
}
