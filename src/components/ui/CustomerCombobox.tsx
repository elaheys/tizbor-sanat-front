import { Plus, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCreateCustomer, useCustomers } from '@/api/customers/queries'
import { cn } from '@/lib/cn'

interface CustomerComboboxProps {
  value: string | undefined
  displayName: string | undefined
  onChange: (customerId: string | undefined, name: string | undefined) => void
  placeholder?: string
}

export function CustomerCombobox({ value, displayName, onChange, placeholder }: CustomerComboboxProps) {
  const [query, setQuery] = useState(displayName ?? '')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const customers = useCustomers()
  const createCustomer = useCreateCustomer()

  useEffect(() => {
    setQuery(displayName ?? '')
  }, [displayName])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const matches = (customers.data ?? []).filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
  const exactMatch = (customers.data ?? []).find((c) => c.name.trim().toLowerCase() === query.trim().toLowerCase())

  const selectCustomer = (id: number, name: string) => {
    onChange(String(id), name)
    setQuery(name)
    setOpen(false)
  }

  const clearSelection = () => {
    onChange(undefined, undefined)
  }

  const handleCreate = () => {
    const name = query.trim()
    if (!name) return
    createCustomer.mutate(
      { name },
      {
        onSuccess: (res) => {
          selectCustomer(res.data.id, res.data.name)
        },
      },
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex h-[38px] items-center gap-2 rounded-[10px] border border-border bg-surface px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-soft">
        <Search className="size-3.5 shrink-0 text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            if (value) clearSelection()
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[13px] text-ink outline-none"
        />
      </div>

      {open && (
        <div className="shadow-card absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-[10px] border border-border bg-surface p-1">
          {matches.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCustomer(c.id, c.name)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-start text-[13px] hover:bg-surface-alt"
            >
              <span>{c.name}</span>
              {c.phone && <span className="text-[11px] text-muted" dir="ltr">{c.phone}</span>}
            </button>
          ))}

          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={handleCreate}
              disabled={createCustomer.isPending}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-[13px] font-semibold text-brand-dark hover:bg-brand-soft',
                createCustomer.isPending && 'opacity-50',
              )}
            >
              <Plus className="size-3.5" />
              {createCustomer.isPending ? 'در حال ساخت...' : `ساخت مشتری جدید: «${query.trim()}»`}
            </button>
          )}

          {matches.length === 0 && !query.trim() && <p className="p-3 text-center text-xs text-muted">برای جستجو تایپ کنید</p>}
        </div>
      )}
    </div>
  )
}
