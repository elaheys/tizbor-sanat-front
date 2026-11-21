import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function ListRow({
  avatar,
  title,
  subtitle,
  side,
  chevron,
  onClick,
}: {
  avatar?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  side?: ReactNode
  chevron?: boolean
  onClick?: () => void
}) {
  return (
    <div
      className={cn('flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-0', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      {avatar}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-ink">{title}</div>
        {subtitle && <div className="tabular-fa mt-0.5 truncate text-[11.5px] text-muted">{subtitle}</div>}
      </div>
      {(side || chevron) && (
        <div className="flex shrink-0 items-center gap-2">
          {side}
          {chevron && <ChevronLeft className="size-3.5 text-muted" />}
        </div>
      )}
    </div>
  )
}
