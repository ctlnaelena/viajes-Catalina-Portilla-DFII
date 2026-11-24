// Servidor GraphQL mock: un schema real (graphql-js) con sus resolvers.
// MSW recibe el POST /graphql y lo ejecuta aquí, igual que haría un backend.
import { buildSchema, graphql } from 'graphql'
import { destinos } from './data/destinos.js'
import { vuelos, hoteles } from './data/vuelosHoteles.js'

export const typeDefs = /* GraphQL */ `
  "Ciudad o lugar al que se puede viajar"
  type Destino {
    id: ID!
    nombre: String!
    pais: String!
    continente: String!
    aeropuerto: String!
    vuelos(soloDisponibles: Boolean, maxPrecio: Int): [Vuelo!]!
    hoteles(soloDisponibles: Boolean, minEstrellas: Int): [Hotel!]!
  }

  type Vuelo {
    id: ID!
    destinoId: ID!
    aerolinea: String!
    codigoVuelo: String!
    origen: String!
    destino: String!
    fechaSalida: String!
    fechaRegreso: String!
    duracionHoras: Int!
    escalas: Int!
    clase: String!
    precio: Int!
    asientosDisponibles: Int!
    disponible: Boolean!
  }

  type Hotel {
    id: ID!
    destinoId: ID!
    nombre: String!
    estrellas: Int!
    calificacion: Float!
    precioNoche: Int!
    disponibleDesde: String!
    disponibleHasta: String!
    habitacionesDisponibles: Int!
    disponible: Boolean!
    servicios: [String!]!
    distanciaCentroKm: Float!
  }

  enum OrdenPrecio {
    ASC
    DESC
  }

  type Query {
    destino(id: ID!): Destino
    vuelos(destinoId: ID!, soloDisponibles: Boolean, maxPrecio: Int, orden: OrdenPrecio): [Vuelo!]!
    hoteles(destinoId: ID!, soloDisponibles: Boolean, minEstrellas: Int, orden: OrdenPrecio): [Hotel!]!
    vuelo(id: ID!): Vuelo
    hotel(id: ID!): Hotel
  }
`

const schema = buildSchema(typeDefs)

function filtrarVuelos(destinoId, { soloDisponibles, maxPrecio, orden } = {}) {
  let lista = vuelos.filter((v) => v.destinoId === destinoId)
  if (soloDisponibles) lista = lista.filter((v) => v.disponible)
  if (maxPrecio) lista = lista.filter((v) => v.precio <= maxPrecio)
  if (orden) lista = [...lista].sort((a, b) => (orden === 'ASC' ? a.precio - b.precio : b.precio - a.precio))
  return lista
}

function filtrarHoteles(destinoId, { soloDisponibles, minEstrellas, orden } = {}) {
  let lista = hoteles.filter((h) => h.destinoId === destinoId)
  if (soloDisponibles) lista = lista.filter((h) => h.disponible)
  if (minEstrellas) lista = lista.filter((h) => h.estrellas >= minEstrellas)
  if (orden) lista = [...lista].sort((a, b) => (orden === 'ASC' ? a.precioNoche - b.precioNoche : b.precioNoche - a.precioNoche))
  return lista
}

// Resolvers (con buildSchema se pasan como rootValue).
const rootValue = {
  destino: ({ id }) => {
    const d = destinos.find((x) => x.id === id)
    if (!d) return null
    return {
      ...d,
      vuelos: (args) => filtrarVuelos(d.id, args),
      hoteles: (args) => filtrarHoteles(d.id, args),
    }
  },
  vuelos: ({ destinoId, ...args }) => filtrarVuelos(destinoId, args),
  hoteles: ({ destinoId, ...args }) => filtrarHoteles(destinoId, args),
  vuelo: ({ id }) => vuelos.find((v) => v.id === id) ?? null,
  hotel: ({ id }) => hoteles.find((h) => h.id === id) ?? null,
}

export function ejecutarGraphQL({ query, variables, operationName }) {
  return graphql({ schema, source: query, rootValue, variableValues: variables, operationName })
}
