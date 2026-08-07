import { useState, type ReactNode } from 'react'

// ─── Mini Calendar ────────────────────────────────────────────────────────────
interface CalEvent { day: number; label: string; color: string }

export function MiniCalendar({ month = 'January 2026', events = [] }: { month?: string; events?: CalEvent[] }) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  // Jan 2026 starts on Thursday (day 4)
  const startDay = 4
  const totalDays = 31
  const today = 15

  const cells: (number | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const eventMap = new Map(events.map(e => [e.day, e]))

  return (
    <div>
      <div className="text-xs font-semibold text-[#0F172A] mb-3">{month}</div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-[#94A3B8] font-semibold pb-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const ev = eventMap.get(day)
          const isToday = day === today
          return (
            <div
              key={i}
              className={`relative flex items-center justify-center h-6 w-6 mx-auto rounded-full text-[10px] font-medium cursor-default transition-colors ${
                isToday ? 'bg-[#1B3A6B] text-white' :
                ev ? 'hover:bg-[#EEF4FF]' :
                'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
              title={ev?.label}
            >
              {day}
              {ev && !isToday && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: ev.color }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

