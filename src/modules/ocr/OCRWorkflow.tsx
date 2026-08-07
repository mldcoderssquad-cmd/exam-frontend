import { AppShell } from '@/layouts'
import { useState } from 'react'
import { Card, ArrowLeftIcon, ChevronRightIcon } from '@/components/common'
import type { User, Screen, AnswerSheetOCR, QuestionMark } from '@/types'
import { MOCK_SHEETS, MOCK_QUESTIONS } from '@/services/ocr/mockData'
import { STEPS, Stepper } from './shared'
import { useOCR } from '@/hooks'
import StepUpload from './upload'
import { StepProcessing, StepResults } from './extraction'
import StepVerification from './verification'
import StepMapping from './mapping'
import { StepAIEvaluation, StepFacultyVerification } from '@/modules/evaluation'

interface OCRWorkflowProps {
  user: User
  onNavigate: (s: Screen) => void
  onLogout: () => void
}

export default function OCRWorkflow({ user, onNavigate, onLogout }: OCRWorkflowProps) {
  const { step, setStep, completedSteps, advance, stepOrder, currentIdx, goToPrevious, goToNext } = useOCR('upload')
  const [sheets, setSheets] = useState<AnswerSheetOCR[]>(MOCK_SHEETS)
  const [questions, setQuestions] = useState<QuestionMark[]>(MOCK_QUESTIONS)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  return (
    <AppShell
      user={{ name: user.name, role: user.role, email: user.email }}
      onNavigate={onNavigate}
      onLogout={onLogout}
      activeSection="ocr"
    >
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <button onClick={() => onNavigate('dashboard-faculty')} className="hover:text-[#1B3A6B] transition-colors">
            Faculty Dashboard
          </button>
          <ChevronRightIcon size={14} />
          <span className="text-[#0F172A] font-medium">OCR Evaluation Workflow</span>
          <ChevronRightIcon size={14} />
          <span className="text-[#3B5DE8] font-medium">{STEPS.find(s => s.id === step)?.label}</span>
        </div>

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Answer Sheet Evaluation</h1>
            <p className="text-sm text-[#475569] mt-0.5">OCR-powered evaluation workflow with AI assistance and faculty verification.</p>
          </div>
          <button
            onClick={() => onNavigate('dashboard-faculty')}
            className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#1B3A6B] font-medium transition-colors"
          >
            <ArrowLeftIcon size={14} /> Exit Workflow
          </button>
        </div>

        {/* Stepper */}
        <Card className="py-3 overflow-x-auto">
          <Stepper current={step} completed={completedSteps} />
        </Card>

        {/* Step content */}
        {step === 'upload' && (
          <StepUpload onNext={() => advance('processing')} />
        )}
        {step === 'processing' && (
          <StepProcessing onNext={() => advance('results')} />
        )}
        {step === 'results' && (
          <StepResults
            sheets={sheets}
            onNext={() => advance('verification')}
            onVerifySheet={id => { setVerifyingId(id); advance('verification') }}
          />
        )}
        {step === 'verification' && (
          <StepVerification
            sheets={sheets}
            onSheetsUpdate={setSheets}
            onNext={() => advance('mapping')}
            verifyingId={verifyingId}
            onVerifySheet={setVerifyingId}
          />
        )}
        {step === 'mapping' && (
          <StepMapping
            sheets={sheets}
            onSheetsUpdate={setSheets}
            onNext={() => advance('ai-evaluation')}
          />
        )}
        {step === 'ai-evaluation' && (
          <StepAIEvaluation
            sheet={sheets[0]}
            questions={questions}
            onQuestionsUpdate={setQuestions}
            onNext={() => advance('faculty-verification')}
          />
        )}
        {step === 'faculty-verification' && (
          <StepFacultyVerification
            sheets={sheets}
            questions={questions}
            onSubmitToHOD={() => onNavigate('dashboard-faculty')}
            onNavigate={onNavigate}
          />
        )}

        {/* Step nav pills */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={goToPrevious}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#1B3A6B] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon size={14} /> Previous Step
          </button>
          <span className="text-xs text-[#94A3B8]">Step {currentIdx + 1} of {STEPS.length}</span>
          <button
            onClick={goToNext}
            disabled={currentIdx === stepOrder.length - 1}
            className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#1B3A6B] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Skip to Next <ChevronRightIcon size={14} />
          </button>
        </div>
      </div>
    </AppShell>
  )
}
