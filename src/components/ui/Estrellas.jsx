export default function Estrellas({ cantidad, max = 5 }) {
  return (
    <span className="inline-flex text-acento" role="img" aria-label={`${cantidad} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 ${i < cantidad ? '' : 'text-slate-200'}`} fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5Z" />
        </svg>
      ))}
    </span>
  )
}
