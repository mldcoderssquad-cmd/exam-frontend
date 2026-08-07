import type { UserRole } from '@/types'

// ─── RoleBadge ────────────────────────────────────────────────────────────────
const roleConfig: Record<UserRole, { bg: string; text: string }> = {
  Admin: { bg: "bg-[#EEF4FF]", text: "text-[#1B3A6B]" },
  Dean: { bg: "bg-[#F3E8FF]", text: "text-[#6B21A8]" },
  HOD: { bg: "bg-[#E0F2FE]", text: "text-[#075985]" },
  Faculty: { bg: "bg-[#F0FDF4]", text: "text-[#065F46]" },
}

export function RoleBadge({ role }: { role: UserRole }) {
  const cfg = roleConfig[role]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {role}
    </span>
  )
}

