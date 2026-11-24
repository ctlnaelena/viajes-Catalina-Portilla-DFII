import { useState } from 'react'
import { api } from '../api/restClient.js'
import { graphqlRequest } from '../api/graphqlClient.js'

const CONSULTA_EJEMPLO = `query {
  vuelos(destinoId: "cusco", soloDisponibles: true, orden: ASC) {
    aerolinea
    fechaSalida
    precio
    asientosDisponibles
  }
}`

const endpoints = [
  { metodo: 'GET', ruta: 'api/destinos', desc: 'Lista destinos. Filtros: ?q= y ?continente=' },
  { metodo: 'GET', ruta: 'api/destinos/:id', desc: 'Detalle de un destino (404 si no existe)' },
  { metodo: 'GET', ruta: 'api/continentes', desc: 'Continentes disponibles' },
  { metodo: 'POST', ruta: 'graphql', desc: 'Queries: destino, vuelos, hoteles, vuelo, hotel' },
]

export default function Acerca() {
  const [consulta, setConsulta] = useState(CONSULTA_EJEMPLO)
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)

  const ejecutar = async (fn) => {
    setCargando(true)
    try {
      setResultado(JSON.stringify(await fn(), null, 2))
    } catch (e) {
      setResultado(`Error: ${e.message}`)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Cómo funciona</h1>
      <p className="mt-3 text-slate-600">
        El frontend en React consume dos APIs simuladas que corren dentro del navegador gracias a{' '}
        <strong>Mock Service Worker (MSW)</strong>: intercepta las peticiones <code>fetch</code> reales y responde
        como un backend, por lo que el sitio funciona igual en local y publicado en GitHub Pages.
      </p>

      <h2 className="mt-10 text-xl font-bold">Endpoints</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr><th className="px-4 py-3">Método</th><th className="px-4 py-3">Ruta</th><th className="px-4 py-3">Descripción</th></tr>
          </thead>
          <tbody>
            {endpoints.map((e) => (
              <tr key={e.ruta} className="border-t border-slate-100">
                <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-xs font-bold ${e.metodo === 'GET' ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'}`}>{e.metodo}</span></td>
                <td className="px-4 py-3 font-mono">{e.ruta}</td>
                <td className="px-4 py-3 text-slate-600">{e.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">Pruébalo</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="consulta" className="text-sm font-semibold">Consulta GraphQL</label>
          <textarea
            id="consulta"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            spellCheck="false"
            rows={10}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-tinta p-4 font-mono text-xs text-emerald-200 outline-none focus:ring-4 focus:ring-marca-100"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => ejecutar(() => graphqlRequest(consulta))} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800">
              Ejecutar GraphQL
            </button>
            <button type="button" onClick={() => ejecutar(() => api.listarDestinos({ continente: 'Europa' }))} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              GET destinos?continente=Europa
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Respuesta</p>
          <pre data-testid="respuesta-api" className="mt-2 h-72 overflow-auto rounded-2xl border border-slate-200 bg-white p-4 text-xs" aria-live="polite">
            {cargando ? 'Consultando…' : resultado ?? 'Ejecuta una consulta para ver la respuesta.'}
          </pre>
        </div>
      </div>
    </div>
  )
}
