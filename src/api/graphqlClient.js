// Cliente GraphQL mínimo basado en fetch (POST con query + variables).
import { GRAPHQL_URL } from './config.js'

export async function graphqlRequest(query, variables = {}, { signal } = {}) {
  const res = await fetch(new URL(GRAPHQL_URL, document.baseURI), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  })
  if (!res.ok) throw new Error(`Error ${res.status} en el servidor GraphQL`)
  const { data, errors } = await res.json()
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(' · '))
  return data
}
