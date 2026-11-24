// Cliente de la API REST (destinos).
import { REST_URL } from './config.js'

async function getJSON(ruta, { signal, params } = {}) {
  const url = new URL(`${REST_URL}${ruta}`, document.baseURI)
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  })
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(json.error ?? `Error ${res.status} al consultar la API`)
    error.status = res.status
    throw error
  }
  return json
}

export const api = {
  listarDestinos: (filtros, opts) => getJSON('/destinos', { ...opts, params: filtros }),
  obtenerDestino: (id, opts) => getJSON(`/destinos/${encodeURIComponent(id)}`, opts),
  listarContinentes: (opts) => getJSON('/continentes', opts),
}
