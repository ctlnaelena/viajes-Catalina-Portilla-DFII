import { formatoCLP, formatoFecha } from '../../utils/formato.js'
import Disponibilidad from '../ui/Disponibilidad.jsx'
import Estrellas from '../ui/Estrellas.jsx'
import Etiqueta from '../ui/Etiqueta.jsx'

export default function HotelCard({ hotel, seleccionado, onSeleccionar }) {
  const agotado = !hotel.disponible
  return (
    <article
      data-testid="hotel"
      className={`flex flex-col rounded-2xl border bg-white p-5 transition ${
        seleccionado ? 'border-marca-600 ring-4 ring-marca-100' : 'border-slate-200'
      } ${agotado ? 'opacity-60' : 'hover:shadow-md'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Estrellas cantidad={hotel.estrellas} />
          <h3 className="mt-1 text-lg font-bold leading-snug">{hotel.nombre}</h3>
          <p className="text-xs text-slate-500">A {hotel.distanciaCentroKm} km del centro</p>
        </div>
        <span className="shrink-0 rounded-xl bg-marca-700 px-2.5 py-1.5 text-sm font-bold text-white" title="Calificación de huéspedes">
          {hotel.calificacion.toFixed(1)}
        </span>
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Servicios">
        {hotel.servicios.map((s) => <li key={s}><Etiqueta>{s}</Etiqueta></li>)}
      </ul>

      <p className="mt-3 text-xs text-slate-500">
        Disponible del {formatoFecha(hotel.disponibleDesde)} al {formatoFecha(hotel.disponibleHasta)}
      </p>
      <div className="mt-2"><Disponibilidad cantidad={hotel.habitacionesDisponibles} unidad="habitaciones" /></div>

      <div className="flex-1" />
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Por noche (hab. doble)</p>
          <p className="text-xl font-extrabold">{formatoCLP(hotel.precioNoche)}</p>
        </div>
        <button
          type="button"
          disabled={agotado}
          aria-pressed={seleccionado}
          onClick={() => onSeleccionar(hotel)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 ${
            seleccionado ? 'bg-marca-700 text-white hover:bg-marca-800' : 'bg-tinta text-white hover:bg-slate-700'
          }`}
        >
          {agotado ? 'Sin cupos' : seleccionado ? '✓ Elegido' : 'Elegir hotel'}
        </button>
      </div>
    </article>
  )
}
