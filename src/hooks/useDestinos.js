import { api } from '../api/restClient.js'
import { useAsync } from './useAsync.js'

// REST: GET /api/destinos
export function useDestinos({ q = '', continente = '' } = {}) {
  const { data, ...resto } = useAsync(
    (signal) => api.listarDestinos({ q, continente }, { signal }),
    [q, continente],
  )
  return { destinos: data?.data ?? [], total: data?.total ?? 0, ...resto }
}

// REST: GET /api/destinos/:id
export function useDestino(id) {
  const { data, ...resto } = useAsync((signal) => api.obtenerDestino(id, { signal }), [id])
  return { destino: data?.data ?? null, ...resto }
}

// REST: GET /api/continentes
export function useContinentes() {
  const { data } = useAsync((signal) => api.listarContinentes({ signal }), [])
  return data?.data ?? []
}
