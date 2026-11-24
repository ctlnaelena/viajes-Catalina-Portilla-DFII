import { bandera } from '../../utils/formato.js'

// Ilustración generada con CSS (gradiente + patrón) a partir de los colores
// del destino. Evita depender de imágenes externas y carga al instante.
export default function Portada({ destino, className = '', children }) {
  const [c1, c2] = destino.colores
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-25" preserveAspectRatio="none" viewBox="0 0 400 200">
        <path d="M0 150 Q 80 90 160 140 T 320 120 T 400 130 V200 H0Z" fill="white" fillOpacity=".35" />
        <path d="M0 175 Q 100 130 200 165 T 400 155 V200 H0Z" fill="white" fillOpacity=".5" />
        <circle cx="320" cy="55" r="26" fill="white" fillOpacity=".55" />
      </svg>
      <span aria-hidden="true" className="absolute right-4 top-3 text-3xl drop-shadow">{bandera(destino.codigoPais)}</span>
      {children}
    </div>
  )
}
