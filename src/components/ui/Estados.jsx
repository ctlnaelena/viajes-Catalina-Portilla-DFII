// Componentes reutilizables para los estados de una petición.

export function Cargando({ texto = 'Cargando…' }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 py-6 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-marca-500 border-t-transparent" />
      {texto}
    </div>
  )
}

export function TarjetaEsqueleto({ alto = 'h-64' }) {
  return <div aria-hidden="true" className={`skeleton rounded-2xl ${alto}`} />
}

export function MensajeError({ error, onReintentar }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
      <p className="font-semibold">No pudimos cargar la información.</p>
      <p className="mt-1 text-sm">{error?.message ?? 'Error desconocido'}</p>
      {onReintentar && (
        <button type="button" onClick={onReintentar} className="mt-4 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
          Reintentar
        </button>
      )}
    </div>
  )
}

export function SinResultados({ titulo, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-lg font-semibold">{titulo}</p>
      {children && <div className="mt-2 text-sm text-slate-500">{children}</div>}
    </div>
  )
}
