import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { XIcon } from '../Icons'

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  children,
  maxWidth = "max-w-md",
}: {
  open: boolean
  onClose?: () => void
  children: ReactNode
  maxWidth?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] w-full ${maxWidth} animate-fade-in`}
      >
        {children}
      </div>
    </div>
  )
}

