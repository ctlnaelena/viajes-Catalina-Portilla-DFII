// Pestañas accesibles (role="tablist") reutilizables.
export default function Pestanas({ opciones, activa, onCambio }) {
  return (
    <div role="tablist" aria-label="Opciones del viaje" className="inline-flex rounded-full bg-slate-200/70 p-1">
      {opciones.map((o) => (
        <button
          key={o.id}
          role="tab"
          id={`tab-${o.id}`}
          aria-selected={activa === o.id}
          aria-controls={`panel-${o.id}`}
          onClick={() => onCambio(o.id)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            activa === o.id ? 'bg-white text-tinta shadow-sm' : 'text-slate-600 hover:text-tinta'
          }`}
        >
          {o.texto}
          {o.cuenta !== undefined && <span className="ml-1.5 text-xs text-slate-500">({o.cuenta})</span>}
        </button>
      ))}
    </div>
  )
}
