export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="UIX"
      className={`object-contain ${className ?? ''}`}
    />
  )
}
