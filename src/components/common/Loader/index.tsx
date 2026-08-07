import type { ReactNode } from 'react'

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({
  size = "sm",
  color = "white",
}: {
  size?: "sm" | "md" | "lg"
  color?: string
}) {
  const sz = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }[size]
  const strokeColor = color === "white" ? "text-white" : "text-[#1B3A6B]"
  return (
    <svg
      className={`${sz} animate-spin-slow ${strokeColor}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

