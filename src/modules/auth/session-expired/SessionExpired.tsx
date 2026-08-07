import { ExamEvaluateLogo, Button, Alert } from '@/components/common'
import { ClockIcon } from '@/components/common'

// ─── Session Expired ──────────────────────────────────────────────────────────
interface SessionExpiredProps {
  onReturnToLogin: () => void
}

export function SessionExpired({ onReturnToLogin }: SessionExpiredProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md text-center space-y-6 animate-fade-in">
        <ExamEvaluateLogo size="md" />

        <div className="flex flex-col items-center gap-3 mt-8">
          <div className="w-20 h-20 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center">
            <ClockIcon size={36} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Session Expired</h1>
            <p className="text-sm text-[#475569] mt-2 max-w-xs mx-auto leading-relaxed">
              Your session has timed out after a period of inactivity. For security, you have been signed out.
            </p>
          </div>
        </div>

        <Alert variant="warning"
          message="Your work may have been saved automatically. Please sign in again to continue where you left off." />

        <Button variant="primary" size="lg" fullWidth onClick={onReturnToLogin}>
          Sign In Again
        </Button>

        <p className="text-xs text-[#94A3B8]">
          Sessions expire after 60 minutes of inactivity to protect your account.
        </p>
      </div>
    </div>
  )
}

