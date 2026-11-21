import { ArrowDownLeft, ArrowUpRight, Repeat, Wrench } from 'lucide-react'
import type { TransactionType } from '@/types/transaction'

const config: Record<TransactionType, { icon: typeof ArrowUpRight; className: string }> = {
  sale: { icon: ArrowUpRight, className: 'bg-brand-soft text-brand-dark' },
  purchase: { icon: ArrowDownLeft, className: 'bg-danger-soft text-danger' },
  repair: { icon: Wrench, className: 'bg-accent-soft text-accent-ink' },
  exchange: { icon: Repeat, className: 'bg-edit-soft text-edit' },
}

export function TxIcon({ type }: { type: TransactionType }) {
  const { icon: Icon, className } = config[type]
  return (
    <div className={`flex size-[34px] shrink-0 items-center justify-center rounded-[10px] ${className}`}>
      <Icon className="size-[17px]" />
    </div>
  )
}
