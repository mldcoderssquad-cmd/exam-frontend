import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'

// ─── Table ────────────────────────────────────────────────────────────────────
export function Table({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-[#E2E8F0] ${className}`}
    >
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function Th({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <th
      className={`text-left px-4 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wide bg-[#F8FAFC] border-b border-[#E2E8F0] ${className}`}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <td
      className={`px-4 py-3 text-[#0F172A] border-b border-[#F1F5F9] ${className}`}
    >
      {children}
    </td>
  )
}

