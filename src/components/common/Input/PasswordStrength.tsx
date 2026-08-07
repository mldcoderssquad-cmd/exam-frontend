import { useState, type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { CheckIcon, CircleIcon } from '../Icons'

// ─── PasswordStrength ─────────────────────────────────────────────────────────
export function getPasswordStrength(
  password: string,
): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: "Very Weak", color: "#DC2626" }
  if (score === 2) return { score: 2, label: "Weak", color: "#D97706" }
  if (score === 3) return { score: 3, label: "Fair", color: "#F59E0B" }
  if (score === 4) return { score: 4, label: "Strong", color: "#059669" }
  return { score: 5, label: "Very Strong", color: "#047857" }
}

export function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null
  const strength = getPasswordStrength(password)
  const pct = (strength.score / 5) * 100

  const reqs = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /[0-9]/.test(password), text: "One number" },
    { met: /[^A-Za-z0-9]/.test(password), text: "One special character" },
  ]

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, backgroundColor: strength.color }}
          />
        </div>
        <span className="text-xs font-medium" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {reqs.map((r) => (
          <div key={r.text} className="flex items-center gap-1.5 text-xs">
            <span className={r.met ? "text-[#059669]" : "text-[#94A3B8]"}>
              {r.met ? <CheckIcon size={12} /> : <CircleIcon size={12} />}
            </span>
            <span className={r.met ? "text-[#059669]" : "text-[#94A3B8]"}>
              {r.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

