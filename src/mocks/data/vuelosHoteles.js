// Datos de vuelos y hoteles que expone la API GraphQL mock.
// Se generan de forma determinística (siempre los mismos valores) a partir
// de los destinos, para no escribir a mano 80 registros.
import { destinos } from './destinos.js'

// Precio base aproximado (CLP) de un vuelo ida y vuelta desde Santiago.
const BASE_VUELO = {
  cusco: 420000,
  'san-pedro-de-atacama': 180000,
  'buenos-aires': 210000,
  'rio-de-janeiro': 390000,
  cancun: 690000,
  'nueva-york': 820000,
  madrid: 990000,
  roma: 1090000,
  tokio: 1650000,
  sidney: 1480000,
}

const BASE_HOTEL = {
  cusco: 55000,
  'san-pedro-de-atacama': 85000,
  'buenos-aires': 60000,
  'rio-de-janeiro': 75000,
  cancun: 120000,
  'nueva-york': 190000,
  madrid: 110000,
  roma: 125000,
  tokio: 140000,
  sidney: 150000,
}

const AEROLINEAS = ['LATAM', 'Sky Airline', 'JetSMART', 'Aerolíneas Argentinas', 'Iberia', 'American Airlines', 'Copa Airlines', 'Qantas']
const CLASES = ['Económica', 'Económica', 'Premium Economy', 'Ejecutiva']
const PREFIJOS_HOTEL = ['Hotel', 'Boutique', 'Casa', 'Grand']
const NOMBRES_HOTEL = ['Mirador', 'Plaza Central', 'Los Viajeros', 'Real', 'Aurora', 'del Puerto', 'Estación', 'Jardín']
const SERVICIOS = ['Wi-Fi', 'Desayuno incluido', 'Piscina', 'Gimnasio', 'Spa', 'Estacionamiento', 'Traslado aeropuerto', 'Mascotas']

// Pseudoaleatorio con semilla (mulberry32): mismos datos en cada carga.
function rng(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const seedDe = (txt) => [...txt].reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7) >>> 0
const pick = (r, arr) => arr[Math.floor(r() * arr.length)]
const redondear = (n) => Math.round(n / 1000) * 1000
const iso = (d) => d.toISOString().slice(0, 10)

function sumarDias(fecha, dias) {
  const d = new Date(fecha)
  d.setUTCDate(d.getUTCDate() + dias)
  return d
}

function generarVuelos(destino) {
  const r = rng(seedDe('v' + destino.id))
  const inicio = new Date(Date.UTC(2026, 11, 5)) // 5 dic 2026
  return Array.from({ length: 6 }, (_, i) => {
    const salida = sumarDias(inicio, i * 12 + Math.floor(r() * 8))
    const duracionViaje = 5 + Math.floor(r() * 9)
    const escalas = destino.continente === 'América del Sur' ? Math.floor(r() * 2) : 1 + Math.floor(r() * 2)
    const clase = pick(r, CLASES)
    const factorClase = clase === 'Ejecutiva' ? 2.6 : clase === 'Premium Economy' ? 1.5 : 1
    const asientos = i === 3 ? 0 : 1 + Math.floor(r() * 23) // uno agotado para mostrar el estado
    const horasBase = { 'América del Sur': 3, 'América del Norte': 10, Europa: 14, Asia: 26, 'Oceanía': 15 }[destino.continente]
    return {
      id: `${destino.id}-v${i + 1}`,
      destinoId: destino.id,
      aerolinea: pick(r, AEROLINEAS),
      codigoVuelo: `${String.fromCharCode(65 + Math.floor(r() * 26))}${String.fromCharCode(65 + Math.floor(r() * 26))}${100 + Math.floor(r() * 899)}`,
      origen: 'SCL',
      destino: destino.aeropuerto,
      fechaSalida: iso(salida),
      fechaRegreso: iso(sumarDias(salida, duracionViaje)),
      duracionHoras: horasBase + escalas * 2 + Math.floor(r() * 3),
      escalas,
      clase,
      precio: redondear(BASE_VUELO[destino.id] * factorClase * (0.85 + r() * 0.4)),
      asientosDisponibles: asientos,
      disponible: asientos > 0,
    }
  })
}

function generarHoteles(destino) {
  const r = rng(seedDe('h' + destino.id))
  return Array.from({ length: 5 }, (_, i) => {
    const estrellas = 2 + Math.floor(r() * 4)
    const habitaciones = i === 2 ? 0 : 1 + Math.floor(r() * 15)
    const desde = sumarDias(new Date(Date.UTC(2026, 11, 1)), Math.floor(r() * 20))
    const servicios = SERVICIOS.filter(() => r() > 0.5)
    return {
      id: `${destino.id}-h${i + 1}`,
      destinoId: destino.id,
      nombre: `${pick(r, PREFIJOS_HOTEL)} ${pick(r, NOMBRES_HOTEL)} ${destino.nombre}`,
      estrellas,
      calificacion: Math.round((6.8 + r() * 3.1) * 10) / 10,
      precioNoche: redondear(BASE_HOTEL[destino.id] * (0.6 + estrellas * 0.25) * (0.85 + r() * 0.3)),
      disponibleDesde: iso(desde),
      disponibleHasta: iso(sumarDias(desde, 60 + Math.floor(r() * 60))),
      habitacionesDisponibles: habitaciones,
      disponible: habitaciones > 0,
      servicios: servicios.length ? servicios : ['Wi-Fi'],
      distanciaCentroKm: Math.round(r() * 80) / 10,
    }
  })
}

export const vuelos = destinos.flatMap(generarVuelos)
export const hoteles = destinos.flatMap(generarHoteles)
