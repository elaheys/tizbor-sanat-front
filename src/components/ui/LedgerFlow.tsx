import { ArrowLeft } from 'lucide-react'

export function LedgerFlow({ fromName, toName }: { fromName: string; toName: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] font-semibold">
      <div className="flex min-w-16 flex-1 flex-col items-center gap-0.5">
        <span className="text-[12.5px]">{fromName}</span>
        <span className="text-[9.5px] font-medium text-muted">بدهکار</span>
      </div>
      <ArrowLeft className="h-3.5 w-[30px] flex-1 text-muted" />
      <div className="flex min-w-16 flex-1 flex-col items-center gap-0.5">
        <span className="text-[12.5px]">{toName}</span>
        <span className="text-[9.5px] font-medium text-muted">طلبکار</span>
      </div>
    </div>
  )
}
