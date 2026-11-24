// Handlers de MSW (Mock Service Worker): interceptan las peticiones de red
// del navegador y responden como lo haría un backend real.
import { http, HttpResponse, delay } from 'msw'
import { destinos } from './data/destinos.js'
import { ejecutarGraphQL } from './graphqlSchema.js'

// Latencia simulada para que se vean los estados de carga.
const LATENCIA_MS = import.meta.env.MODE === 'test' ? 0 : 450

const normalizar = (txt) =>
  txt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export const handlers = [
  // ---------- API REST ----------
  // GET /api/destinos?q=texto&continente=Europa
  http.get('*/api/destinos', async ({ request }) => {
    await delay(LATENCIA_MS)
    const url = new URL(request.url)
    const q = normalizar(url.searchParams.get('q') ?? '')
    const continente = url.searchParams.get('continente')

    let resultado = destinos
    if (continente) resultado = resultado.filter((d) => d.continente === continente)
    if (q) {
      resultado = resultado.filter((d) =>
        normalizar([d.nombre, d.pais, ...d.actividades].join(' ')).includes(q),
      )
    }
    return HttpResponse.json({ total: resultado.length, data: resultado })
  }),

  // GET /api/destinos/:id
  http.get('*/api/destinos/:id', async ({ params }) => {
    await delay(LATENCIA_MS)
    const destino = destinos.find((d) => d.id === params.id)
    if (!destino) {
      return HttpResponse.json({ error: `No existe el destino "${params.id}"` }, { status: 404 })
    }
    return HttpResponse.json({ data: destino })
  }),

  // GET /api/continentes
  http.get('*/api/continentes', async () => {
    await delay(LATENCIA_MS / 3)
    return HttpResponse.json({ data: [...new Set(destinos.map((d) => d.continente))] })
  }),

  // ---------- API GraphQL ----------
  // POST /graphql  { query, variables, operationName }
  http.post('*/graphql', async ({ request }) => {
    await delay(LATENCIA_MS)
    const body = await request.json()
    const resultado = await ejecutarGraphQL(body)
    return HttpResponse.json(resultado)
  }),
]
