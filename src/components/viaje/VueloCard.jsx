import { formatoCLP, formatoFecha } from '../../utils/formato.js'
import Disponibilidad from '../ui/Disponibilidad.jsx'
import Etiqueta from '../ui/Etiqueta.jsx'

export default function VueloCard({ vuelo, seleccionado, onSeleccionar }) {
  const agotado = !vuelo.disponible
  return (
    <article
      data-testid="vuelo"
      className={`rounded-2xl border bg-white p-5 transition ${
        seleccionado ? 'border-marca-600 ring-4 ring-marca-100' : 'border-slate-200'
      } ${agotado ? 'opacity-60' : 'hover:shadow-md'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold">{vuelo.aerolinea}</span>
          <span className="text-xs text-slate-500">{vuelo.codigoVuelo}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Etiqueta tono="marca">{vuelo.clase}</Etiqueta>
          <Disponibilidad cantidad={vuelo.asientosDisponibles} unidad="asientos" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div>
          <p className="text-2xl font-extrabold">{vuelo.origen}</p>
          <p className="text-xs text-slate-500">Ida · {formatoFecha(vuelo.fechaSalida)}</p>
        </div>
        <div className="flex flex-col items-center text-xs text-slate-500">
          <span>{vuelo.duracionHoras} h</span>
          <span className="my-1 h-px w-full bg-slate-300" />
          <span>{vuelo.escalas === 0 ? 'Directo' : `${vuelo.escalas} escala${vuelo.escalas > 1 ? 's' : ''}`}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold">{vuelo.destino}</p>
          <p className="text-xs text-slate-500">Vuelta · {formatoFecha(vuelo.fechaRegreso)}</p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Ida y vuelta por persona</p>
          <p className="text-xl font-extrabold text-tinta">{formatoCLP(vuelo.precio)}</p>
        </div>
        <button
          type="button"
          disabled={agotado}
          aria-pressed={seleccionado}
          onClick={() => onSeleccionar(vuelo)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 ${
            seleccionado ? 'bg-marca-700 text-white hover:bg-marca-800' : 'bg-tinta text-white hover:bg-slate-700'
          }`}
        >
          {agotado ? 'Sin cupos' : seleccionado ? '✓ Elegido' : 'Elegir vuelo'}
        </button>
      </div>
    </article>
  )
}
