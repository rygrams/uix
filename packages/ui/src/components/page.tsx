import { cn } from '@app/ui/lib/utils'

export function Page({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full px-3', className)} {...props} />
}

export function PageHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-card mb-6 flex items-center justify-between p-4', className)}
      {...props}
    />
  )
}

export function PageHeaderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn('text-primary text-lg font-bold', className)} {...props} />
  )
}

export function PageHeaderActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-3', className)} {...props} />
}

export function PageContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-card p-4', className)} {...props} />
}
