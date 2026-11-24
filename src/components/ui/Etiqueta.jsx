const tonos = {
  neutro: 'bg-slate-100 text-slate-700',
  marca: 'bg-marca-50 text-marca-800',
  ok: 'bg-emerald-50 text-emerald-700',
  alerta: 'bg-amber-50 text-amber-800',
  error: 'bg-red-50 text-red-700',
  oscuro: 'bg-white/15 text-white backdrop-blur',
}

export default function Etiqueta({ tono = 'neutro', children }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tonos[tono]}`}>{children}</span>
}
