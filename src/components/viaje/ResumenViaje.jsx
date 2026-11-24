import { Link } from 'react-router-dom'
import { useViaje } from '../../context/ViajeContext.jsx'
import { formatoCLP } from '../../utils/formato.js'

// Resumen compacto del plan; se usa en el detalle del destino.
export default function ResumenViaje({ destinoId }) {
  const { viaje, total, noches } = useViaje()
  const esEste = viaje.destino?.id === destinoId
  const vuelo = esEste ? viaje.vuelo : null
  const hotel = esEste ? viaje.hotel : null

  return (
    <aside aria-label="Resumen de tu viaje" className="rounded-2xl bg-tinta p-6 text-white shadow-xl">
      <h2 className="text-lg font-bold">Tu viaje</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-slate-400">Vuelo</dt>
          <dd className="font-semibold">{vuelo ? `${vuelo.aerolinea} · ${vuelo.clase}` : 'Aún no eliges'}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Hotel</dt>
          <dd className="font-semibold">{hotel ? hotel.nombre : 'Aún no eliges'}</dd>
        </div>
        {vuelo && (
          <div>
            <dt className="text-slate-400">Estadía</dt>
            <dd className="font-semibold">{noches} noches · {viaje.pasajeros} pasajero{viaje.pasajeros > 1 ? 's' : ''}</dd>
          </div>
        )}
      </dl>
      <div className="mt-5 border-t border-white/15 pt-4">
        <p className="text-sm text-slate-400">Total estimado</p>
        <p className="text-2xl font-extrabold" data-testid="total-resumen">{formatoCLP(esEste ? total : 0)}</p>
      </div>
      <Link
        to="/mi-viaje"
        className={`mt-5 block rounded-full py-3 text-center text-sm font-bold transition-colors ${
          vuelo || hotel ? 'bg-acento text-tinta hover:bg-amber-400' : 'pointer-events-none bg-white/10 text-slate-400'
        }`}
        aria-disabled={!(vuelo || hotel)}
        tabIndex={vuelo || hotel ? undefined : -1}
      >
        Ver mi plan de viaje
      </Link>
    </aside>
  )
}
