import { setupWorker } from 'msw/browser'
import { getResponse } from 'msw'
import { handlers } from './handlers.js'

export const worker = setupWorker(...handlers)

/**
 * Plan B de compatibilidad: algunos navegadores no permiten Service Workers
 * (Firefox en ventana privada, Safari con ciertas restricciones, abrir el
 * sitio como archivo local). En ese caso se envuelve window.fetch y las
 * peticiones a la API se resuelven con los mismos handlers de MSW.
 */
function activarFallbackEnMemoria() {
  const fetchOriginal = window.fetch.bind(window)
  window.fetch = async (input, init) => {
    const request = new Request(input, init)
    const respuesta = await getResponse(handlers, request)
    return respuesta ?? fetchOriginal(input, init)
  }
  console.info('[mock] Service Worker no disponible: usando backend mock en memoria.')
}

export async function iniciarBackendMock() {
  if (!('serviceWorker' in navigator)) {
    activarFallbackEnMemoria()
    return
  }
  try {
    await worker.start({
      // BASE_URL = './' -> funciona en localhost y en GitHub Pages (subcarpeta del repo)
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
      onUnhandledRequest: 'bypass',
      quiet: import.meta.env.PROD,
    })
  } catch (error) {
    console.warn('[mock] No se pudo registrar el Service Worker:', error)
    activarFallbackEnMemoria()
  }
}
