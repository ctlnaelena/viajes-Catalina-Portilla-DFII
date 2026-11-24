import DestinoCard from './DestinoCard.jsx'
import { MensajeError, SinResultados, TarjetaEsqueleto } from '../ui/Estados.jsx'

export default function GrillaDestinos({ destinos, loading, error, onReintentar, esqueletos = 6 }) {
  if (error) return <MensajeError error={error} onReintentar={onReintentar} />
  if (loading && destinos.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {Array.from({ length: esqueletos }, (_, i) => <TarjetaEsqueleto key={i} alto="h-80" />)}
      </div>
    )
  }
  if (destinos.length === 0) {
    return <SinResultados titulo="No encontramos destinos">Prueba con otra búsqueda o continente.</SinResultados>
  }
  return (
    <ul className={`grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-60' : ''}`} data-testid="lista-destinos">
      {destinos.map((d) => (
        <li key={d.id} className="flex"><DestinoCard destino={d} /></li>
      ))}
    </ul>
  )
}
