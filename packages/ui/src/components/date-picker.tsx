import { Button } from '@app/ui/components/button'
import { Calendar } from '@app/ui/components/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@app/ui/components/popover'
import { cn } from '@app/ui/lib/utils'
import { format, parse } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'
import { useMemo } from 'react'
import type { DateRange, Matcher } from 'react-day-picker'

type DateRangeValue = {
  from?: string
  to?: string
}

type DatePickerBaseProps = {
  placeholder?: string
  className?: string
  buttonClassName?: string
  clearable?: boolean
  disabledDays?: Matcher | Matcher[]
}

type SingleDatePickerProps = DatePickerBaseProps & {
  mode?: 'single'
  value?: string
  onChange: (nextValue: string) => void
}

type RangeDatePickerProps = DatePickerBaseProps & {
  mode: 'range'
  value?: DateRangeValue
  onChange: (nextValue: DateRangeValue) => void
}

type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps

function fromIsoDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  return parse(value, 'yyyy-MM-dd', new Date())
}

function toIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

// eslint-disable-next-line complexity
export function DatePicker(props: DatePickerProps) {
  if (props.mode === 'range') {
    return <DateRangePicker {...props} />
  }

  return <DateSinglePicker {...props} />
}

function DateSinglePicker({
  value = '',
  onChange,
  placeholder,
  className,
  buttonClassName,
  clearable = true,
  disabledDays,
}: SingleDatePickerProps) {
  const selectedDate = useMemo(() => fromIsoDate(value), [value])
  const dateLabel = selectedDate
    ? format(selectedDate, 'dd/MM/yyyy')
    : (placeholder ?? 'Sélectionner une date')
  const label =
    selectedDate && placeholder ? `${placeholder}: ${dateLabel}` : dateLabel

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn('h-8 w-40 justify-between font-normal', buttonClassName)}
          >
            {label}
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={fr}
            selected={selectedDate}
            onSelect={(date) => onChange(date ? toIsoDate(date) : '')}
            captionLayout="dropdown"
            disabled={disabledDays}
          />
        </PopoverContent>
      </Popover>

      {clearable && value ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => onChange('')}
          aria-label="Effacer la date"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}

function DateRangePicker({
  value,
  onChange,
  placeholder,
  className,
  buttonClassName,
  clearable = true,
}: RangeDatePickerProps) {
  const selectedRange = useMemo(() => {
    const from = value?.from ? fromIsoDate(value.from) : undefined
    const to = value?.to ? fromIsoDate(value.to) : undefined

    return { from, to } satisfies DateRange
  }, [value])

  const label = formatRangeLabel(selectedRange, placeholder)
  const hasValue = Boolean(selectedRange.from || selectedRange.to)

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn('h-8 w-56 justify-between font-normal', buttonClassName)}
          >
            {label}
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            locale={fr}
            selected={selectedRange}
            onSelect={(range) =>
              onChange({
                from: range?.from ? toIsoDate(range.from) : undefined,
                to: range?.to ? toIsoDate(range.to) : undefined,
              })
            }
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>

      {clearable && hasValue ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => onChange({})}
          aria-label="Effacer la période"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}

// eslint-disable-next-line complexity
function formatRangeLabel(selectedRange?: DateRange, placeholder?: string) {
  const { from, to } = selectedRange ?? {}
  if (!from) return placeholder ?? 'Sélectionner une période'
  const fromLabel = format(from, 'dd/MM/yyyy')
  const toLabel = to ? format(to, 'dd/MM/yyyy') : '...'
  return `${fromLabel} - ${toLabel}`
}
