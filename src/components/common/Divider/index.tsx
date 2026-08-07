import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-[#E2E8F0]" />
  return (
    <div className="flex items-center gap-3">
      <hr className="flex-1 border-[#E2E8F0]" />
      <span className="text-xs text-[#94A3B8] font-medium">{label}</span>
      <hr className="flex-1 border-[#E2E8F0]" />
    </div>
  )
}

