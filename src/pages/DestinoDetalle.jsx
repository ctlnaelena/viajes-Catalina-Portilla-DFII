import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDestino } from '../hooks/useDestinos.js'
import { useVuelosHoteles } from '../hooks/useVuelosHoteles.js'
import { useViaje } from '../context/ViajeContext.jsx'
import Portada from '../components/destinos/Portada.jsx'
import Etiqueta from '../components/ui/Etiqueta.jsx'
import { Cargando, MensajeError, SinResultados, TarjetaEsqueleto } from '../components/ui/Estados.jsx'
import Pestanas from '../components/viaje/Pestanas.jsx'
import FiltrosOpciones from '../components/viaje/FiltrosOpciones.jsx'
import VueloCard from '../components/viaje/VueloCard.jsx'
import HotelCard from '../components/viaje/HotelCard.jsx'
import ResumenViaje from '../components/viaje/ResumenViaje.jsx'
import NoEncontrado from './NoEncontrado.jsx'

const filtrosIniciales = { soloDisponibles: false, orden: '', maxPrecio: '', minEstrellas: '' }

export default function DestinoDetalle() {
  const { id } = useParams()
  const { destino, loading, error, reintentar } = useDestino(id)

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <TarjetaEsqueleto alto="h-64" />
        <Cargando texto="Cargando destino…" />
      </div>
    )
  }
  if (error?.status === 404) return <NoEncontrado mensaje={`No encontramos el destino "${id}".`} />
  if (error) return <div className="mx-auto max-w-6xl px-4 py-10"><MensajeError error={error} onReintentar={reintentar} /></div>

  // key={id}: al cambiar de destino se reinicia el estado interno (filtros, pestaña).
  return <DetalleContenido key={id} destino={destino} />
}

function DetalleContenido({ destino }) {
  const [pestana, setPestana] = useState('vuelos')
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const { viaje, elegirVuelo, elegirHotel } = useViaje()

  // Consulta GraphQL (vuelos + hoteles) que se repite al cambiar filtros.
  const { vuelos, hoteles, loading, error, reintentar } = useVuelosHoteles(destino.id, {
    soloDisponibles: filtros.soloDisponibles,
    orden: filtros.orden,
    maxPrecio: filtros.maxPrecio ? Number(filtros.maxPrecio) : null,
    minEstrellas: filtros.minEstrellas ? Number(filtros.minEstrellas) : null,
  })

  const esEste = viaje.destino?.id === destino.id
  const lista = pestana === 'vuelos' ? vuelos : hoteles
  const resumenDestino = { id: destino.id, nombre: destino.nombre, pais: destino.pais, codigoPais: destino.codigoPais, colores: destino.colores }

  return (
    <>
      <Portada destino={destino} className="text-white">
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-8 sm:pb-14">
          <nav aria-label="Ruta de navegación" className="text-sm text-white/80">
            <Link to="/destinos" className="hover:text-white hover:underline">Destinos</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{destino.nombre}</span>
          </nav>
          <h1 className="mt-6 text-4xl font-extrabold drop-shadow sm:text-6xl">{destino.nombre}</h1>
          <p className="mt-1 text-lg font-medium text-white/90">{destino.pais} · {destino.continente}</p>
          <p className="mt-4 max-w-2xl text-white/90">{destino.descripcion}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Etiqueta tono="oscuro">Clima: {destino.clima}</Etiqueta>
            <Etiqueta tono="oscuro">Mejor época: {destino.mejorEpoca}</Etiqueta>
            <Etiqueta tono="oscuro">Aeropuerto: {destino.aeropuerto}</Etiqueta>
          </div>
        </div>
      </Portada>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section aria-labelledby="titulo-actividades">
          <h2 id="titulo-actividades" className="text-xl font-bold">Actividades populares</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {destino.actividades.map((a) => (
              <li key={a} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold">{a}</li>
            ))}
          </ul>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          <section aria-label="Vuelos y hoteles">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Pestanas
                activa={pestana}
                onCambio={setPestana}
                opciones={[
                  { id: 'vuelos', texto: 'Vuelos', cuenta: loading ? undefined : vuelos.length },
                  { id: 'hoteles', texto: 'Hoteles', cuenta: loading ? undefined : hoteles.length },
                ]}
              />
              <p className="text-xs text-slate-500">Desde Santiago (SCL) · precios en CLP</p>
            </div>

            <div className="mt-4">
              <FiltrosOpciones filtros={filtros} onCambio={setFiltros} pestana={pestana} />
            </div>

            <div id={`panel-${pestana}`} role="tabpanel" aria-labelledby={`tab-${pestana}`} className="mt-6">
              {error ? (
                <MensajeError error={error} onReintentar={reintentar} />
              ) : loading && lista.length === 0 ? (
                <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
                  {[1, 2, 3, 4].map((i) => <TarjetaEsqueleto key={i} alto="h-56" />)}
                </div>
              ) : lista.length === 0 ? (
                <SinResultados titulo={`No hay ${pestana} con esos filtros`}>
                  <button type="button" className="font-semibold text-marca-700 hover:underline" onClick={() => setFiltros(filtrosIniciales)}>
                    Limpiar filtros
                  </button>
                </SinResultados>
              ) : (
                <ul className={`grid gap-4 md:grid-cols-2 ${loading ? 'opacity-60' : ''}`}>
                  {pestana === 'vuelos'
                    ? vuelos.map((v) => (
                        <li key={v.id} className="flex [&>*]:w-full">
                          <VueloCard vuelo={v} seleccionado={esEste && viaje.vuelo?.id === v.id} onSeleccionar={(x) => elegirVuelo(resumenDestino, x)} />
                        </li>
                      ))
                    : hoteles.map((h) => (
                        <li key={h.id} className="flex [&>*]:w-full">
                          <HotelCard hotel={h} seleccionado={esEste && viaje.hotel?.id === h.id} onSeleccionar={(x) => elegirHotel(resumenDestino, x)} />
                        </li>
                      ))}
                </ul>
              )}
            </div>
          </section>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ResumenViaje destinoId={destino.id} />
          </div>
        </div>
      </div>
    </>
  )
}
