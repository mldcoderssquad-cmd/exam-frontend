import type { AccountStatus } from '@/types'

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const statusConfig: Record<AccountStatus, {
  label: string
  bg: string
  text: string
  dot: string
}> = {
  Active: {
    label: "Active",
    bg: "bg-[#D1FAE5]",
    text: "text-[#065F46]",
    dot: "bg-[#059669]",
  },
  "Pending Activation": {
    label: "Pending",
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    dot: "bg-[#D97706]",
  },
  Inactive: {
    label: "Inactive",
    bg: "bg-[#F1F5F9]",
    text: "text-[#475569]",
    dot: "bg-[#94A3B8]",
  },
  Suspended: {
    label: "Suspended",
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    dot: "bg-[#DC2626]",
  },
  Locked: {
    label: "Locked",
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    dot: "bg-[#DC2626]",
  },
}

export function StatusBadge({ status }: { status: AccountStatus }) {
  const cfg = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  )
}

