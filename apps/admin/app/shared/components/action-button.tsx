import { Button } from '@heroui/react'

type ButtonProps = React.ComponentProps<typeof Button>

// Solid dark (inverted) button used instead of HeroUI's blue primary:
// near-black on light, near-white on dark.
const DARK =
  'bg-foreground text-background hover:bg-foreground/90 ' +
  'disabled:bg-foreground/40 rounded-xl'

export function ActionButton({ className, ...props }: ButtonProps) {
  return <Button className={`${DARK} ${className ?? ''}`} {...props} />
}
