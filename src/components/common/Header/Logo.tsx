import type { ReactNode } from 'react'

// ─── Logo ─────────────────────────────────────────────────────────────────────
export function ExamEvaluateLogo({
  size = "md",
  inverse = false,
}: {
  size?: "sm" | "md" | "lg"
  inverse?: boolean
}) {
  const sizes = { sm: 32, md: 40, lg: 52 }
  const px = sizes[size]
  const textColor = inverse ? "text-white" : "text-[#1B3A6B]"
  const subColor = inverse ? "text-blue-200" : "text-[#475569]"
  const textSizes = {
    sm: "text-base font-bold",
    md: "text-xl font-bold",
    lg: "text-2xl font-bold",
  }
  const subSizes = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" }

  return (
    <div className="flex items-center gap-3">
      <svg
        width={px}
        height={px}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="10" fill="#1B3A6B" />
        <path
          d="M8 12h24M8 20h16M8 28h20"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="30" cy="28" r="6" fill="#3B5DE8" />
        <path
          d="M27.5 28l1.5 1.5L32.5 26"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div>
        <div
          className={`${textSizes[size]} ${textColor} font-['Inter'] leading-tight tracking-tight`}
        >
          ExamEvaluate
        </div>
        <div
          className={`${subSizes[size]} ${subColor} font-medium tracking-wide uppercase`}
        >
          Secure Evaluation Platform
        </div>
      </div>
    </div>
  )
}

