// Consultas GraphQL que usa la interfaz.
export const VUELOS_Y_HOTELES = /* GraphQL */ `
  query VuelosYHoteles(
    $destinoId: ID!
    $soloDisponibles: Boolean
    $maxPrecio: Int
    $minEstrellas: Int
    $orden: OrdenPrecio
  ) {
    vuelos(destinoId: $destinoId, soloDisponibles: $soloDisponibles, maxPrecio: $maxPrecio, orden: $orden) {
      id
      aerolinea
      codigoVuelo
      origen
      destino
      fechaSalida
      fechaRegreso
      duracionHoras
      escalas
      clase
      precio
      asientosDisponibles
      disponible
    }
    hoteles(destinoId: $destinoId, soloDisponibles: $soloDisponibles, minEstrellas: $minEstrellas, orden: $orden) {
      id
      nombre
      estrellas
      calificacion
      precioNoche
      disponibleDesde
      disponibleHasta
      habitacionesDisponibles
      disponible
      servicios
      distanciaCentroKm
    }
  }
`
