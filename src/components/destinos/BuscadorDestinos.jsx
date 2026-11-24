// Barra de búsqueda + filtro por continente (componente controlado).
export default function BuscadorDestinos({ texto, onTexto, continente, onContinente, continentes }) {
  const chip = (activo) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
      activo ? 'border-marca-700 bg-marca-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
    }`

  return (
    <div className="space-y-4">
      <label className="relative block">
        <span className="sr-only">Buscar destino</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={texto}
          onChange={(e) => onTexto(e.target.value)}
          placeholder="Busca por ciudad, país o actividad (ej: playa, museo, Perú)"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-base shadow-sm outline-none placeholder:text-slate-400 focus:border-marca-500 focus:ring-4 focus:ring-marca-100"
        />
      </label>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar por continente">
        <button type="button" className={chip(!continente)} aria-pressed={!continente} onClick={() => onContinente('')}>
          Todos
        </button>
        {continentes.map((c) => (
          <button key={c} type="button" className={chip(continente === c)} aria-pressed={continente === c} onClick={() => onContinente(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
