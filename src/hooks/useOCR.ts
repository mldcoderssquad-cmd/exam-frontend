import { useState } from 'react'
import { STEPS, type OCRStep } from '@/modules/ocr/shared'

export function useOCR(initial: OCRStep = 'upload') {
  const [step, setStep] = useState<OCRStep>(initial)
  const [completedSteps, setCompletedSteps] = useState<OCRStep[]>([])

  const advance = (to: OCRStep) => {
    setCompletedSteps(prev => prev.includes(step) ? prev : [...prev, step])
    setStep(to)
  }

  const stepOrder: OCRStep[] = STEPS.map(s => s.id)
  const currentIdx = stepOrder.indexOf(step)

  const goToPrevious = () => {
    if (currentIdx > 0) setStep(stepOrder[currentIdx - 1])
  }

  const goToNext = () => {
    if (currentIdx < stepOrder.length - 1) setStep(stepOrder[currentIdx + 1])
  }

  return { step, setStep, completedSteps, advance, stepOrder, currentIdx, goToPrevious, goToNext }
}
