import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
  padding = true,
}: {
  children: ReactNode
  className?: string
  padding?: boolean
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm ${
        padding ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
        {subtitle && (
          <p className="text-sm text-[#475569] mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

