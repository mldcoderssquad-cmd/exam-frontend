import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { EyeIcon, EyeOffIcon, AlertCircleIcon, ErrorIcon } from '../Icons'

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  rightElement?: ReactNode
  leftIcon?: ReactNode
}

export function Input({
  label,
  error,
  hint,
  rightElement,
  leftIcon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
  const hasError = !!error

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#0F172A]">
          {label}
          {props.required && <span className="text-[#DC2626] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full h-10 rounded-lg border bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8]
            transition-all duration-150 outline-none
            ${leftIcon ? "pl-10" : "pl-3"} ${rightElement ? "pr-10" : "pr-3"}
            ${
              hasError
                ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20"
                : "border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#3B5DE8] focus:ring-2 focus:ring-[#3B5DE8]/20"
            }
            disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-[#DC2626] flex items-center gap-1">
          <ErrorIcon size={12} />
          {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-[#94A3B8]">{hint}</p>}
    </div>
  )
}

// ─── PasswordInput ────────────────────────────────────────────────────────────
interface PasswordInputProps
  extends Omit<InputProps, "type" | "rightElement"> {}

export function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = useState(false)
  return (
    <Input
      {...props}
      type={show ? "text" : "password"}
      rightElement={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-[#94A3B8] hover:text-[#475569] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5DE8] rounded"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </button>
      }
    />
  )
}

