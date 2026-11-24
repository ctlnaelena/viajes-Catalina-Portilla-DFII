import { createContext, useContext, useEffect, useState } from 'react'
import { diasEntre } from '../utils/formato.js'

const ViajeContext = createContext(null)
const CLAVE = 'rumbo:mi-viaje'

const viajeVacio = { destino: null, vuelo: null, hotel: null, pasajeros: 1 }

function leerGuardado() {
  try {
    return { ...viajeVacio, ...JSON.parse(localStorage.getItem(CLAVE)) }
  } catch {
    return viajeVacio
  }
}

export function ViajeProvider({ children }) {
  const [viaje, setViaje] = useState(leerGuardado)

  // Persistimos el plan en el navegador cada vez que cambia.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(viaje))
    } catch {
      /* modo privado o almacenamiento bloqueado: se ignora */
    }
  }, [viaje])

  // Si se elige algo de otro destino, se reinicia la selección anterior.
  const conDestino = (prev, destino) =>
    prev.destino?.id === destino.id ? prev : { ...viajeVacio, pasajeros: prev.pasajeros, destino }

  const elegirVuelo = (destino, vuelo) =>
    setViaje((prev) => {
      const base = conDestino(prev, destino)
      return { ...base, vuelo: base.vuelo?.id === vuelo.id ? null : vuelo }
    })

  const elegirHotel = (destino, hotel) =>
    setViaje((prev) => {
      const base = conDestino(prev, destino)
      return { ...base, hotel: base.hotel?.id === hotel.id ? null : hotel }
    })

  const setPasajeros = (n) => setViaje((prev) => ({ ...prev, pasajeros: Math.min(9, Math.max(1, n)) }))
  const quitarVuelo = () => setViaje((prev) => ({ ...prev, vuelo: null }))
  const quitarHotel = () => setViaje((prev) => ({ ...prev, hotel: null }))
  const limpiar = () => setViaje(viajeVacio)

  const noches = viaje.vuelo ? diasEntre(viaje.vuelo.fechaSalida, viaje.vuelo.fechaRegreso) : 0
  const habitaciones = Math.ceil(viaje.pasajeros / 2)
  const totalVuelo = viaje.vuelo ? viaje.vuelo.precio * viaje.pasajeros : 0
  const totalHotel = viaje.hotel ? viaje.hotel.precioNoche * Math.max(noches, 1) * habitaciones : 0
  const cantidad = (viaje.vuelo ? 1 : 0) + (viaje.hotel ? 1 : 0)

  const valor = {
    viaje,
    noches,
    habitaciones,
    totalVuelo,
    totalHotel,
    total: totalVuelo + totalHotel,
    cantidad,
    elegirVuelo,
    elegirHotel,
    quitarVuelo,
    quitarHotel,
    setPasajeros,
    limpiar,
  }
  return <ViajeContext.Provider value={valor}>{children}</ViajeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useViaje() {
  const ctx = useContext(ViajeContext)
  if (!ctx) throw new Error('useViaje debe usarse dentro de <ViajeProvider>')
  return ctx
}
