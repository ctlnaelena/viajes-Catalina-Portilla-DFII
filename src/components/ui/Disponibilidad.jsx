import Etiqueta from './Etiqueta.jsx'

// Muestra "Agotado", "Últimos N" o "N disponibles" con el color adecuado.
export default function Disponibilidad({ cantidad, unidad }) {
  if (cantidad === 0) return <Etiqueta tono="error">Agotado</Etiqueta>
  if (cantidad <= 3) return <Etiqueta tono="alerta">¡Últimos {cantidad}!</Etiqueta>
  return <Etiqueta tono="ok">{cantidad} {unidad} disponibles</Etiqueta>
}
