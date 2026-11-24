import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContinentes, useDestinos } from '../hooks/useDestinos.js'
import BuscadorDestinos from '../components/destinos/BuscadorDestinos.jsx'
import GrillaDestinos from '../components/destinos/GrillaDestinos.jsx'

export default function Destinos() {
  // Los filtros viven en la URL (?q=...&continente=...) para poder compartirlos.
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const continente = params.get('continente') ?? ''

  // Estado local del input para no consultar la API en cada tecla (debounce).
  const [texto, setTexto] = useState(q)
  useEffect(() => setTexto(q), [q])
  useEffect(() => {
    if (texto === q) return
    const t = setTimeout(() => actualizar({ q: texto }), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto])

  function actualizar(cambios) {
    const sig = new URLSearchParams(params)
    Object.entries(cambios).forEach(([k, v]) => (v ? sig.set(k, v) : sig.delete(k)))
    setParams(sig, { replace: true })
  }

  const continentes = useContinentes()
  const { destinos, total, loading, error, reintentar } = useDestinos({ q, continente })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Explora destinos</h1>
      <p className="mt-2 text-slate-600">Selecciona un destino para ver sus vuelos y hoteles disponibles.</p>

      <div className="mt-8">
        <BuscadorDestinos
          texto={texto}
          onTexto={setTexto}
          continente={continente}
          onContinente={(c) => actualizar({ continente: c })}
          continentes={continentes}
        />
      </div>

      <p className="mt-6 text-sm text-slate-500" aria-live="polite">
        {loading ? 'Buscando…' : `${total} destino${total === 1 ? '' : 's'} encontrado${total === 1 ? '' : 's'}`}
      </p>
      <div className="mt-4">
        <GrillaDestinos destinos={destinos} loading={loading} error={error} onReintentar={reintentar} />
      </div>
    </div>
  )
}
