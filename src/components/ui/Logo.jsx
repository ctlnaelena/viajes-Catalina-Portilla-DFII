export default function Logo({ pequeno = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="./flight-ticket.png"
        alt=""
        className={pequeno ? 'h-7 w-7' : 'h-9 w-9'}
      />
      <span className={`font-extrabold tracking-tight text-tinta ${pequeno ? 'text-base' : 'text-xl'}`}>TERRASEN</span>
    </span>
  )
}
