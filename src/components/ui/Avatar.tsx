import { cn } from '@/lib/cn'
import { nameInitials } from '@/utils/initials'

type Tone = 'accent' | 'edit' | 'danger' | 'brand'

const toneClasses: Record<Tone, string> = {
  accent: 'bg-accent-soft text-accent-ink',
  edit: 'bg-edit-soft text-edit',
  danger: 'bg-danger-soft text-danger',
  brand: 'bg-brand-soft text-brand-dark',
}

export function Avatar({ name, tone = 'edit', className }: { name: string; tone?: Tone; className?: string }) {
  return (
    <div
      className={cn(
        'flex size-[34px] shrink-0 items-center justify-center rounded-full text-xs font-bold',
        toneClasses[tone],
        className,
      )}
    >
      {nameInitials(name)}
    </div>
  )
}
