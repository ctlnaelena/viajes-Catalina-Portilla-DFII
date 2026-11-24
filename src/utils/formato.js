const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
export const formatoCLP = (n) => clp.format(n)

const fecha = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
export const formatoFecha = (iso) => fecha.format(new Date(iso + 'T00:00:00Z'))

// "CL" -> 🇨🇱
export const bandera = (codigo) =>
  String.fromCodePoint(...[...codigo.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)))

export const diasEntre = (desde, hasta) =>
  Math.max(1, Math.round((new Date(hasta) - new Date(desde)) / 86_400_000))
