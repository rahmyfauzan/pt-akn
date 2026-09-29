import { cn } from '@/lib/utils';
import { Quotation } from '@/types';

export default function StatusBadge({ status }: { status: Quotation['status'] }) {
  const config = {
    DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-700' },
    SENT: { label: 'Terkirim', className: 'bg-amber-100 text-amber-700' },
    ACCEPTED: { label: 'Diterima', className: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Ditolak', className: 'bg-red-100 text-red-700' },
  };

  const current = config[status] || config.DRAFT;

  return (
    <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", current.className)}>
      {current.label}
    </span>
  );
}
