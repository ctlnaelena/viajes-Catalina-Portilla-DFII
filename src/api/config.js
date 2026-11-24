// URLs relativas al documento: sirven igual en localhost y en GitHub Pages.
// Para conectar un backend real basta con cambiar estas dos constantes
// (o definir VITE_REST_URL / VITE_GRAPHQL_URL en un archivo .env).
export const REST_URL = import.meta.env.VITE_REST_URL ?? 'api'
export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL ?? 'graphql'
