import { CheckIcon } from '@/components/common'
import { STEPS } from './steps'
import type { OCRStep } from './steps'

// ─── Stepper ──────────────────────────────────────────────────────────────────
export function Stepper({ current, completed }: { current: OCRStep; completed: OCRStep[] }) {
  const currentIdx = STEPS.findIndex(s => s.id === current)
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max px-1 py-3">
        {STEPS.map((step, i) => {
          const isCompleted = completed.includes(step.id)
          const isCurrent = step.id === current
          const isPast = i < currentIdx
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isCompleted || isPast
                    ? 'bg-[#059669] border-[#059669] text-white'
                    : isCurrent
                      ? 'bg-[#1B3A6B] border-[#1B3A6B] text-white shadow-lg shadow-[#1B3A6B]/30'
                      : 'bg-white border-[#E2E8F0] text-[#94A3B8]'
                }`}>
                  {(isCompleted || isPast) ? <CheckIcon size={14} /> : <span>{i + 1}</span>}
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap max-w-[64px] text-center leading-tight ${
                  isCurrent ? 'text-[#1B3A6B]' : (isCompleted || isPast) ? 'text-[#059669]' : 'text-[#94A3B8]'
                }`}>
                  {step.short}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 rounded-full transition-all ${
                  i < currentIdx ? 'bg-[#059669]' : 'bg-[#E2E8F0]'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

