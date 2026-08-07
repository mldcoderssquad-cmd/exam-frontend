import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { Spinner } from '../Loader'

// ─── Button ───────────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "success"
type BtnSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
}

const btnBase =
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none"

const btnVariants: Record<BtnVariant, string> = {
  primary:
    "bg-[#1B3A6B] hover:bg-[#0F2142] active:bg-[#060E20] text-white focus-visible:ring-[#1B3A6B]",
  secondary:
    "bg-white hover:bg-[#F1F5F9] active:bg-[#E2E8F0] text-[#1B3A6B] border border-[#E2E8F0] hover:border-[#CBD5E1] focus-visible:ring-[#1B3A6B]",
  ghost:
    "bg-transparent hover:bg-[#F1F5F9] active:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] focus-visible:ring-[#94A3B8]",
  danger:
    "bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white focus-visible:ring-[#DC2626]",
  success:
    "bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] text-white focus-visible:ring-[#059669]",
}

const btnSizes: Record<BtnSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  fullWidth,
  leftIcon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner
          size="sm"
          color={
            variant === "secondary" || variant === "ghost" ? "navy" : "white"
          }
        />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  )
}

