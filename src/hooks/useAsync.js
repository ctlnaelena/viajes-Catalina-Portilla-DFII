import { useEffect, useState } from 'react'

/**
 * Ejecuta una función asíncrona cada vez que cambian sus dependencias.
 * Maneja carga, error, datos y cancela la petición anterior (AbortController)
 * para evitar condiciones de carrera al cambiar filtros rápido.
 */
export function useAsync(fn, deps) {
  const [estado, setEstado] = useState({ data: null, loading: true, error: null })
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setEstado((prev) => ({ ...prev, loading: true, error: null }))

    fn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setEstado({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setEstado({ data: null, loading: false, error })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, intento])

  const reintentar = () => setIntento((n) => n + 1)
  return { ...estado, reintentar }
}
