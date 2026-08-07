import { useState, type ReactNode } from 'react'

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  trend?: { direction: 'up' | 'down' | 'neutral'; text: string }
  color?: string
  icon?: ReactNode
  onClick?: () => void
}

export function StatCard({ label, value, sub, trend, color = '#1B3A6B', icon, onClick }: StatCardProps) {
  const trendColor = trend?.direction === 'up' ? '#059669' : trend?.direction === 'down' ? '#DC2626' : '#94A3B8'
  const trendArrow = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→'

  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 ${onClick ? 'cursor-pointer hover:border-[#BACFFB] hover:shadow-md transition-all' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide leading-none mb-2">{label}</div>
          <div className="text-2xl font-bold leading-none" style={{ color }}>{value}</div>
          {sub && <div className="text-xs text-[#94A3B8] mt-1.5">{sub}</div>}
          {trend && (
            <div className="mt-1.5 flex items-center gap-1 text-xs font-medium" style={{ color: trendColor }}>
              <span>{trendArrow}</span>
              <span>{trend.text}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

