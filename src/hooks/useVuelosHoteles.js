import { graphqlRequest } from '../api/graphqlClient.js'
import { VUELOS_Y_HOTELES } from '../api/queries.js'
import { useAsync } from './useAsync.js'

// GraphQL: una sola consulta trae vuelos y hoteles del destino con sus filtros.
export function useVuelosHoteles(destinoId, { soloDisponibles, maxPrecio, minEstrellas, orden }) {
  const { data, ...resto } = useAsync(
    (signal) =>
      graphqlRequest(
        VUELOS_Y_HOTELES,
        {
          destinoId,
          soloDisponibles,
          maxPrecio: maxPrecio || null,
          minEstrellas: minEstrellas || null,
          orden: orden || null,
        },
        { signal },
      ),
    [destinoId, soloDisponibles, maxPrecio, minEstrellas, orden],
  )
  return { vuelos: data?.vuelos ?? [], hoteles: data?.hoteles ?? [], ...resto }
}
