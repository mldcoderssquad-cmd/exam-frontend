import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'

// ─── Field Group ──────────────────────────────────────────────────────────────
export function FieldGroup({
  label,
  value,
  className = "",
}: {
  label: string
  value: string | ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[#0F172A]">{value}</dd>
    </div>
  )
}

