import { useState, type ReactNode } from 'react'
import { timelineColors } from '../ChartCard'

// ─── Notification Badge ───────────────────────────────────────────────────────
interface Notification { id: string; title: string; body: string; time: string; type: 'info' | 'warning' | 'success' | 'error'; read?: boolean }

export function NotificationList({ items }: { items: Notification[] }) {
  const [read, setRead] = useState<Set<string>>(new Set())
  return (
    <div className="divide-y divide-[#F1F5F9]">
      {items.map(n => {
        const isRead = read.has(n.id) || n.read
        const cfg = timelineColors[n.type]
        return (
          <div
            key={n.id}
            className={`flex gap-3 px-1 py-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors rounded-lg ${isRead ? 'opacity-60' : ''}`}
            onClick={() => setRead(s => new Set([...s, n.id]))}
          >
            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: isRead ? '#E2E8F0' : cfg.dot }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-xs font-semibold ${isRead ? 'text-[#94A3B8]' : 'text-[#0F172A]'} leading-snug`}>{n.title}</p>
                <span className="text-[10px] text-[#94A3B8] shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5 leading-snug">{n.body}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

