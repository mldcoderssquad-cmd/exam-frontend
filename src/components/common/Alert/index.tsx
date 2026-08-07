import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { CheckCircleIcon, AlertTriangleIcon, AlertCircleIcon, InfoIcon, XIcon } from '../Icons'

// ─── Alert ────────────────────────────────────────────────────────────────────
type AlertVariant = "error" | "success" | "warning" | "info"

interface AlertProps {
  variant: AlertVariant
  title?: string
  message: string
  onDismiss?: () => void
  className?: string
}

const alertConfig: Record<AlertVariant, {
  bg: string
  border: string
  icon: string
  title: string
  text: string
}> = {
  error: {
    bg: "bg-[#FEE2E2]",
    border: "border-[#FECACA]",
    icon: "text-[#DC2626]",
    title: "text-[#991B1B]",
    text: "text-[#991B1B]",
  },
  success: {
    bg: "bg-[#D1FAE5]",
    border: "border-[#A7F3D0]",
    icon: "text-[#059669]",
    title: "text-[#065F46]",
    text: "text-[#065F46]",
  },
  warning: {
    bg: "bg-[#FEF3C7]",
    border: "border-[#FDE68A]",
    icon: "text-[#D97706]",
    title: "text-[#92400E]",
    text: "text-[#92400E]",
  },
  info: {
    bg: "bg-[#E0F2FE]",
    border: "border-[#BAE6FD]",
    icon: "text-[#0284C7]",
    title: "text-[#075985]",
    text: "text-[#075985]",
  },
}

export function Alert({
  variant,
  title,
  message,
  onDismiss,
  className = "",
}: AlertProps) {
  const cfg = alertConfig[variant]
  return (
    <div
      className={`flex gap-3 rounded-lg border p-4 animate-fade-in ${cfg.bg} ${cfg.border} ${className}`}
      role="alert"
    >
      <div className={`shrink-0 mt-0.5 ${cfg.icon}`}>
        {variant === "error" && <AlertCircleIcon size={16} />}
        {variant === "success" && <CheckCircleIcon size={16} />}
        {variant === "warning" && <AlertTriangleIcon size={16} />}
        {variant === "info" && <InfoIcon size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-sm font-semibold ${cfg.title}`}>{title}</p>
        )}
        <p className={`text-sm ${cfg.text} ${title ? "mt-0.5" : ""}`}>
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`shrink-0 ${cfg.icon} hover:opacity-70 transition-opacity`}
          aria-label="Dismiss"
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  )
}

