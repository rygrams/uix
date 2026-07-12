import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@app/ui/lib/utils'

export type EmailTagsInputProps = {
  value: string[]
  onChange: (emails: string[]) => void
  disabled?: boolean
  placeholder?: string
  id?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  className?: string
  tagClassName?: string
  inputClassName?: string
  onInvalidEmail?: (email: string) => void
}

export function EmailTagsInput({
  value,
  onChange,
  disabled,
  placeholder,
  id,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
  className,
  tagClassName,
  inputClassName,
  onInvalidEmail,
}: EmailTagsInputProps) {
  const [inputValue, setInputValue] = React.useState('')

  const addEmail = (email: string) => {
    const trimmed = email.trim()
    if (!trimmed) return

    if (!isValidEmail(trimmed)) {
      onInvalidEmail?.(trimmed)
      return
    }

    if (!value.includes(trimmed)) {
      onChange([...value, trimmed])
    }

    setInputValue('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === ';') {
      event.preventDefault()
      addEmail(inputValue)
      return
    }

    if (event.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div
      className={cn(
        'border-input min-h-9 rounded-md border p-2',
        'flex flex-wrap gap-1.5',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        ariaInvalid &&
          'border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20',
        className,
      )}
    >
      {value.map((email) => (
        <span
          key={email}
          className={cn(
            'bg-muted inline-flex items-center gap-1 rounded px-2 py-0.5 text-sm',
            tagClassName,
          )}
        >
          {email}
          <button
            type="button"
            onClick={() => onChange(value.filter((entry) => entry !== email))}
            disabled={disabled}
            className="hover:text-destructive"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="email"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputValue && addEmail(inputValue)}
        disabled={disabled}
        placeholder={value.length === 0 ? placeholder : undefined}
        id={id}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        className={cn(
          'min-w-24 flex-1 bg-transparent text-sm outline-none',
          inputClassName,
        )}
      />
    </div>
  )
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
