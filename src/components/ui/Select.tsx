import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function Select({ value, onChange, options, placeholder, error, disabled }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <RadixSelect.Root value={value} onValueChange={onChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex h-[38px] w-full items-center justify-between rounded-[10px] border border-border bg-surface px-3 text-[13px] text-ink outline-none transition-colors',
            'focus:border-brand focus:ring-2 focus:ring-brand-soft',
            error && 'border-danger',
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="size-3.5 text-muted" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            className="shadow-card z-50 overflow-hidden rounded-[10px] border border-border bg-surface"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[13px] outline-none data-[highlighted]:bg-surface-alt"
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check className="size-4 text-brand" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
