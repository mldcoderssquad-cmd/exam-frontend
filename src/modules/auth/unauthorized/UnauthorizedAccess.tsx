import { ExamEvaluateLogo, Button, Alert } from '@/components/common'
import { ShieldIcon, ArrowLeftIcon, HomeIcon } from '@/components/common'

// ─── Unauthorized / Access Denied ─────────────────────────────────────────────
interface UnauthorizedAccessProps {
  onReturnToDashboard: () => void
  onGoBack: () => void
  userRole?: string
}

export function UnauthorizedAccess({ onReturnToDashboard, onGoBack, userRole }: UnauthorizedAccessProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md text-center space-y-6 animate-fade-in">
        <ExamEvaluateLogo size="md" />

        <div className="flex flex-col items-center gap-3 mt-8">
          <div className="w-20 h-20 rounded-2xl bg-[#FEE2E2] border border-[#FECACA] flex items-center justify-center">
            <ShieldIcon size={36} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-1">403 · Access Denied</p>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Unauthorized Access</h1>
            <p className="text-sm text-[#475569] mt-2 max-w-xs mx-auto leading-relaxed">
              You do not have permission to access this section.
              {userRole && ` Your current role is ${userRole}.`}
            </p>
          </div>
        </div>

        <Alert variant="error"
          title="Access Denied"
          message="This feature requires elevated permissions. If you believe this is an error, please contact your system administrator." />

        <div className="space-y-3">
          <Button variant="primary" size="lg" fullWidth onClick={onReturnToDashboard} leftIcon={<HomeIcon size={16} />}>
            Return to Dashboard
          </Button>
          <Button variant="secondary" size="md" fullWidth onClick={onGoBack} leftIcon={<ArrowLeftIcon size={16} />}>
            Go Back
          </Button>
        </div>

        <p className="text-xs text-[#94A3B8]">
          This access attempt has been logged for security auditing.
        </p>
      </div>
    </div>
  )
}
