export function QuickAction({
  icon,
  label,
  sub,
  onClick,
  color = '#1B3A6B',
  variant = 'row',
}: {
  icon: string
  label: string
  sub: string
  onClick?: () => void
  color?: string
  variant?: 'row' | 'column'
}) {
  if (variant === 'column') {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-start gap-2 p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#BACFFB] hover:shadow-md transition-all text-left group"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1B3A6B]">{label}</div>
          <div className="text-xs text-[#94A3B8] mt-0.5">{sub}</div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#BACFFB] hover:bg-[#F8FAFC] hover:shadow-sm transition-all text-left w-full"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${color}18` }}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-[#0F172A]">{label}</div>
        <div className="text-xs text-[#94A3B8]">{sub}</div>
      </div>
    </button>
  )
}
