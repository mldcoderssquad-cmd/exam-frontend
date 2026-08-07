import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { CheckCircleIcon, AlertTriangleIcon, AlertCircleIcon, InfoIcon, XIcon } from '../Icons'

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({
  message,
  type = "success",
  visible,
}: {
  message: string
  type?: "success" | "error"
  visible: boolean
}) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
          type === "success"
            ? "bg-[#065F46] border-[#047857] text-white"
            : "bg-[#991B1B] border-[#B91C1C] text-white"
        }`}
      >
        {type === "success" ? (
          <CheckCircleIcon size={16} />
        ) : (
          <AlertCircleIcon size={16} />
        )}
        {message}
      </div>
    </div>
  )
}

