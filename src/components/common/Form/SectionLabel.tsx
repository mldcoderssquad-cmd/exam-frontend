import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'

// ─── Section Label ────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest">
        {children}
      </span>
      <div className="flex-1 h-px bg-[#E2E8F0]" />
    </div>
  )
}

