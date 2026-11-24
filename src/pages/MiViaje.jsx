import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useViaje } from '../context/ViajeContext.jsx'
import { bandera, formatoCLP, formatoFecha } from '../utils/formato.js'
import Estrellas from '../components/ui/Estrellas.jsx'
import { SinResultados } from '../components/ui/Estados.jsx'

export default function MiViaje() {
  const { viaje, noches, habitaciones, totalVuelo, totalHotel, total, setPasajeros, quitarVuelo, quitarHotel, limpiar } = useViaje()
  const [confirmado, setConfirmado] = useState(false)
  const { destino, vuelo, hotel, pasajeros } = viaje

  if (!destino || (!vuelo && !hotel)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">Mi viaje</h1>
        <div className="mt-8">
          <SinResultados titulo="Todavía no armas tu viaje">
            <p>Elige un destino y selecciona un vuelo y/o un hotel.</p>
            <Link to="/destinos" className="mt-4 inline-block rounded-full bg-tinta px-5 py-2.5 font-semibold text-white">Explorar destinos</Link>
          </SinResultados>
        </div>
      </div>
    )
  }

  if (confirmado) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl" aria-hidden="true">✓</div>
        <h1 className="mt-6 text-3xl font-extrabold">¡Cotización generada!</h1>
        <p className="mt-2 text-slate-600">
          Tu viaje a {destino.nombre} por {formatoCLP(total)} quedó registrado. (Simulación: no se realizó ningún cobro.)
        </p>
        <button type="button" onClick={() => { limpiar(); setConfirmado(false) }} className="mt-8 rounded-full bg-tinta px-6 py-3 font-semibold text-white">
          Planear otro viaje
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Mi viaje</h1>
          <p className="mt-1 text-slate-600">
            {bandera(destino.codigoPais)} {destino.nombre}, {destino.pais} ·{' '}
            <Link to={`/destinos/${destino.id}`} className="font-semibold text-marca-700 hover:underline">cambiar opciones</Link>
          </p>
        </div>
        <button type="button" onClick={limpiar} className="text-sm font-semibold text-red-700 hover:underline">Vaciar plan</button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Bloque titulo="Vuelo" onQuitar={vuelo && quitarVuelo}>
            {vuelo ? (
              <>
                <p className="font-bold">{vuelo.aerolinea} · {vuelo.codigoVuelo} <span className="font-normal text-slate-500">({vuelo.clase})</span></p>
                <p className="text-sm text-slate-600">
                  {vuelo.origen} → {vuelo.destino} · {formatoFecha(vuelo.fechaSalida)} al {formatoFecha(vuelo.fechaRegreso)} ·{' '}
                  {vuelo.escalas === 0 ? 'directo' : `${vuelo.escalas} escala(s)`}
                </p>
                <p className="mt-2 text-sm">{formatoCLP(vuelo.precio)} × {pasajeros} = <strong>{formatoCLP(totalVuelo)}</strong></p>
              </>
            ) : (
              <Faltante destinoId={destino.id} texto="Aún no eliges vuelo." />
            )}
          </Bloque>

          <Bloque titulo="Hotel" onQuitar={hotel && quitarHotel}>
            {hotel ? (
              <>
                <p className="font-bold">{hotel.nombre}</p>
                <Estrellas cantidad={hotel.estrellas} />
                <p className="mt-2 text-sm">
                  {formatoCLP(hotel.precioNoche)} × {Math.max(noches, 1)} noche(s) × {habitaciones} hab. = <strong>{formatoCLP(totalHotel)}</strong>
                </p>
                {!vuelo && <p className="mt-1 text-xs text-amber-700">Sin vuelo elegido se calcula 1 noche.</p>}
              </>
            ) : (
              <Faltante destinoId={destino.id} texto="Aún no eliges hotel." />
            )}
          </Bloque>
        </div>

        <aside className="h-fit rounded-2xl bg-tinta p-6 text-white lg:sticky lg:top-24">
          <h2 className="font-bold">Resumen</h2>
          <div className="mt-4 flex items-center justify-between">
            <span id="lbl-pasajeros" className="text-sm text-slate-300">Pasajeros</span>
            <div className="flex items-center gap-3" role="group" aria-labelledby="lbl-pasajeros">
              <button type="button" aria-label="Quitar pasajero" onClick={() => setPasajeros(pasajeros - 1)} disabled={pasajeros <= 1} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg hover:bg-white/20 disabled:opacity-40">−</button>
              <span className="w-4 text-center font-bold" data-testid="pasajeros">{pasajeros}</span>
              <button type="button" aria-label="Agregar pasajero" onClick={() => setPasajeros(pasajeros + 1)} disabled={pasajeros >= 9} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg hover:bg-white/20 disabled:opacity-40">+</button>
            </div>
          </div>
          <dl className="mt-5 space-y-2 border-t border-white/15 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-slate-300">Vuelos</dt><dd>{formatoCLP(totalVuelo)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-300">Hotel</dt><dd>{formatoCLP(totalHotel)}</dd></div>
            <div className="flex justify-between border-t border-white/15 pt-3 text-lg font-extrabold"><dt>Total</dt><dd data-testid="total-viaje">{formatoCLP(total)}</dd></div>
          </dl>
          <button type="button" onClick={() => setConfirmado(true)} className="mt-6 w-full rounded-full bg-acento py-3 font-bold text-tinta hover:bg-amber-400">
            Solicitar cotización
          </button>
        </aside>
      </div>
    </div>
  )
}

function Bloque({ titulo, onQuitar, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-marca-700">{titulo}</h2>
        {onQuitar && <button type="button" onClick={onQuitar} className="text-sm text-slate-500 hover:text-red-700">Quitar</button>}
      </div>
      {children}
    </section>
  )
}

function Faltante({ destinoId, texto }) {
  return (
    <p className="text-sm text-slate-500">
      {texto} <Link to={`/destinos/${destinoId}`} className="font-semibold text-marca-700 hover:underline">Elegir ahora</Link>
    </p>
  )
}
