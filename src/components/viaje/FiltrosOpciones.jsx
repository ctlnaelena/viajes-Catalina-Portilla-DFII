// Filtros que se envían como variables a la consulta GraphQL.
export default function FiltrosOpciones({ filtros, onCambio, pestana }) {
  const set = (campo) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    onCambio({ ...filtros, [campo]: e.target.type === 'checkbox' ? v : v === '' ? '' : v })
  }
  const control = 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-marca-500 focus:ring-4 focus:ring-marca-100'

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <label className="inline-flex items-center gap-2 px-2 text-sm font-medium">
        <input type="checkbox" checked={filtros.soloDisponibles} onChange={set('soloDisponibles')} className="h-4 w-4 accent-marca-700" />
        Solo con disponibilidad
      </label>

      <label className="inline-flex items-center gap-2 text-sm">
        <span className="text-slate-500">Ordenar</span>
        <select value={filtros.orden} onChange={set('orden')} className={control}>
          <option value="">Recomendados</option>
          <option value="ASC">Precio: menor a mayor</option>
          <option value="DESC">Precio: mayor a menor</option>
        </select>
      </label>

      {pestana === 'vuelos' ? (
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="text-slate-500">Precio máx.</span>
          <select value={filtros.maxPrecio} onChange={set('maxPrecio')} className={control}>
            <option value="">Sin límite</option>
            {[300000, 500000, 800000, 1200000, 1800000].map((p) => (
              <option key={p} value={p}>{p.toLocaleString('es-CL')} CLP</option>
            ))}
          </select>
        </label>
      ) : (
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="text-slate-500">Estrellas</span>
          <select value={filtros.minEstrellas} onChange={set('minEstrellas')} className={control}>
            <option value="">Todas</option>
            {[3, 4, 5].map((n) => <option key={n} value={n}>{n}+ ★</option>)}
          </select>
        </label>
      )}
    </div>
  )
}
