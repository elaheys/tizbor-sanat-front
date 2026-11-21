import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('overflow-hidden rounded-[14px] border border-border bg-surface', className)} {...props} />
}
