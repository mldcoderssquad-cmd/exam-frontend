import { useState, type ReactNode } from 'react'

export const SERIES_COLORS = ['#1B3A6B', '#3B5DE8', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0284C7']

// ─── Horizontal Bar Chart ─────────────────────────────────────────────────────
interface HBarItem { label: string; value: number; color?: string; sub?: string }

interface HBarChartProps {
  data: HBarItem[]
  maxValue?: number
  unit?: string
  height?: number
  showValues?: boolean
}

export function HBarChart({ data, maxValue, unit = '', showValues = true }: HBarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1)

  return (
    <div className="space-y-2.5">
      {data.map((item, i) => {
        const pct = Math.round((item.value / max) * 100)
        const color = item.color ?? SERIES_COLORS[i % SERIES_COLORS.length]
        const isHovered = hovered === i
        return (
          <div
            key={item.label}
            className="group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-medium transition-colors ${isHovered ? 'text-[#0F172A]' : 'text-[#475569]'}`}>
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                {item.sub && <span className="text-[10px] text-[#94A3B8]">{item.sub}</span>}
                {showValues && (
                  <span className="text-xs font-bold" style={{ color }}>{item.value}{unit}</span>
                )}
              </div>
            </div>
            <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: color, opacity: isHovered ? 1 : 0.85 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Grouped Bar Chart (SVG) ──────────────────────────────────────────────────
interface GroupedBarSeries { label: string; color: string }
interface GroupedBarData { group: string; values: number[] }

interface GroupedBarChartProps {
  series: GroupedBarSeries[]
  data: GroupedBarData[]
  height?: number
  unit?: string
  maxValue?: number
}

export function GroupedBarChart({ series, data, height = 180, unit = '', maxValue }: GroupedBarChartProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; values: { name: string; value: number; color: string }[] } | null>(null)
  const max = maxValue ?? Math.max(...data.flatMap(d => d.values), 1)
  const padL = 36; const padB = 28; const padT = 12; const padR = 12
  const W = 360; const H = height
  const chartW = W - padL - padR
  const chartH = H - padT - padB
  const groupW = chartW / data.length
  const barW = Math.min((groupW / series.length) * 0.7, 20)
  const gap = (groupW - barW * series.length) / 2

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: height }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = padT + chartH * (1 - t)
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#F1F5F9" strokeWidth="1" />
              <text x={padL - 4} y={y + 3.5} textAnchor="end" fontSize="9" fill="#94A3B8">
                {Math.round(max * t)}{unit}
              </text>
            </g>
          )
        })}
        {/* Baseline */}
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#E2E8F0" strokeWidth="1" />

        {/* Bars */}
        {data.map((group, gi) => {
          const groupX = padL + gi * groupW + gap
          return (
            <g key={group.group}>
              {group.values.map((val, si) => {
                const barH = (val / max) * chartH
                const x = groupX + si * barW
                const y = padT + chartH - barH
                return (
                  <rect
                    key={si}
                    x={x + 1} y={y} width={barW - 2} height={barH}
                    rx="3" ry="3"
                    fill={series[si]?.color ?? SERIES_COLORS[si]}
                    opacity={0.88}
                    className="cursor-pointer hover:opacity-100 transition-opacity"
                    onMouseEnter={e => setTooltip({
                      x: e.clientX, y: e.clientY,
                      label: group.group,
                      values: group.values.map((v, i) => ({ name: series[i]?.label ?? `Series ${i+1}`, value: v, color: series[i]?.color ?? SERIES_COLORS[i] }))
                    })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
              <text x={groupX + (barW * series.length) / 2} y={padT + chartH + 16} textAnchor="middle" fontSize="9" fill="#94A3B8">
                {group.group.length > 8 ? group.group.slice(0, 7) + '…' : group.group}
              </text>
            </g>
          )
        })}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2">
        {series.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] text-[#475569] font-medium">{s.label}</span>
          </div>
        ))}
      </div>
      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-[#0F172A] text-white rounded-lg px-3 py-2.5 text-xs shadow-xl pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <div className="font-semibold mb-1.5">{tooltip.label}</div>
          {tooltip.values.map(v => (
            <div key={v.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: v.color }} />
              <span className="text-[#94A3B8]">{v.name}:</span>
              <span className="font-semibold">{v.value}{unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
interface DonutSegment { label: string; value: number; color: string }

interface DonutChartProps {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string | number
}

export function DonutChart({ segments, size = 120, thickness = 18, centerLabel, centerValue }: DonutChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const total = segments.reduce((s, d) => s + d.value, 0)
  if (total === 0) return null

  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r

  let offset = 0
  const slices = segments.map((seg, i) => {
    const pct = seg.value / total
    const dash = pct * circumference
    const slice = { ...seg, dash, gap: circumference - dash, offset, i }
    offset += dash + 2 // 2px surface gap between segments
    return slice
  })

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {slices.map((slice, i) => (
            <circle
              key={slice.label}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth={thickness}
              strokeDasharray={`${slice.dash - 2} ${circumference - slice.dash + 2}`}
              strokeDashoffset={-slice.offset}
              strokeLinecap="round"
              opacity={hovered === null ? 0.9 : hovered === i ? 1 : 0.4}
              className="transition-opacity cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        {centerValue !== undefined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold text-[#0F172A] leading-none">{centerValue}</div>
            {centerLabel && <div className="text-[9px] text-[#94A3B8] mt-0.5 text-center leading-tight">{centerLabel}</div>}
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="space-y-2 flex-1 min-w-0">
        {slices.map((slice, i) => {
          const pct = Math.round((slice.value / total) * 100)
          return (
            <div
              key={slice.label}
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${hovered !== null && hovered !== i ? 'opacity-40' : 'opacity-100'}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-xs text-[#475569] truncate flex-1">{slice.label}</span>
              <span className="text-xs font-bold text-[#0F172A] shrink-0">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
  showArea?: boolean
}

export function Sparkline({ data, color = '#1B3A6B', width = 80, height = 28, showArea = true }: SparklineProps) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${pts[pts.length-1].x},${height} L0,${height} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {showArea && <path d={areaPath} fill={color} fillOpacity="0.12" />}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="2.5" fill={color} />
    </svg>
  )
}

// ─── Activity Timeline ────────────────────────────────────────────────────────
interface TimelineEvent {
  time: string
  title: string
  sub?: string
  type: 'success' | 'info' | 'warning' | 'error' | 'neutral'
  icon?: ReactNode
}

export const timelineColors = {
  success: { dot: '#059669', bg: '#D1FAE5', text: '#065F46' },
  info: { dot: '#3B5DE8', bg: '#EEF4FF', text: '#1B3A6B' },
  warning: { dot: '#D97706', bg: '#FEF3C7', text: '#92400E' },
  error: { dot: '#DC2626', bg: '#FEE2E2', text: '#991B1B' },
  neutral: { dot: '#94A3B8', bg: '#F1F5F9', text: '#475569' },
}

export function ActivityTimeline({ events, maxItems = 6 }: { events: TimelineEvent[]; maxItems?: number }) {
  const shown = events.slice(0, maxItems)
  return (
    <div className="space-y-0">
      {shown.map((ev, i) => {
        const cfg = timelineColors[ev.type]
        return (
          <div key={i} className="flex gap-3 group">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: cfg.bg }}>
                {ev.icon ?? <div className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />}
              </div>
              {i < shown.length - 1 && <div className="w-px flex-1 bg-[#E2E8F0] my-1" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{ev.title}</p>
                  {ev.sub && <p className="text-xs text-[#94A3B8] mt-0.5">{ev.sub}</p>}
                </div>
                <span className="text-[10px] text-[#94A3B8] shrink-0 mt-0.5 font-medium">{ev.time}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
export function ProgressRing({ value, max = 100, size = 56, color = '#1B3A6B', label }: {
  value: number; max?: number; size?: number; color?: string; label?: string
}) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth="5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{Math.round(pct * 100)}%</span>
        {label && <span className="text-[8px] text-[#94A3B8] leading-none mt-0.5">{label}</span>}
      </div>
    </div>
  )
}


// ─── Workflow Arrow Card ──────────────────────────────────────────────────────
export function WorkflowCard({ steps }: { steps: { label: string; status: 'done' | 'active' | 'pending' }[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1">
          <div className={`px-2.5 py-1 rounded-md text-[10px] font-semibold ${
            s.status === 'done' ? 'bg-[#D1FAE5] text-[#065F46]' :
            s.status === 'active' ? 'bg-[#1B3A6B] text-white' :
            'bg-[#F1F5F9] text-[#94A3B8]'
          }`}>{s.label}</div>
          {i < steps.length - 1 && <span className="text-[#CBD5E1] text-xs">›</span>}
        </div>
      ))}
    </div>
  )
}
