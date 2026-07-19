import { Input } from '@heroui/react'

type InputProps = React.ComponentProps<typeof Input>

const OUTLINE =
  'rounded-xl border-2 border-border bg-transparent shadow-none transition-colors ' +
  'hover:border-border-secondary focus:border-accent'

export function OutlineInput({ className, ...props }: InputProps) {
  return <Input className={`${OUTLINE} ${className ?? ''}`} {...props} />
}
