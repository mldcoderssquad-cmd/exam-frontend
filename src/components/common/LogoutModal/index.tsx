import { useState } from 'react'
import { Button, Modal, Spinner, Alert } from '@/components/common'
import { LogOutIcon } from '@/components/common'

// ─── Logout Modal ─────────────────────────────────────────────────────────────
type LogoutState = 'confirm' | 'processing' | 'logged-out'

interface LogoutModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  const [state, setState] = useState<LogoutState>('confirm')

  const handleLogout = () => {
    setState('processing')
    setTimeout(() => {
      setState('logged-out')
      setTimeout(() => {
        onConfirm()
        setState('confirm')
      }, 1000)
    }, 1200)
  }

  return (
    <Modal open={open} onClose={state === 'confirm' ? onClose : undefined}>
      <div className="p-6">
        {state === 'confirm' && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center shrink-0">
                <LogOutIcon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Sign Out of ExamEvaluate?</h3>
                <p className="text-sm text-[#475569] mt-1 leading-relaxed">
                  You will be signed out of your current session. Any unsaved work will be lost.
                  You can sign back in at any time.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="md" fullWidth onClick={onClose}>Stay Signed In</Button>
              <Button variant="danger" size="md" fullWidth onClick={handleLogout} leftIcon={<LogOutIcon size={14} />}>
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {state === 'processing' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Spinner size="lg" color="navy" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0F172A]">Signing Out…</p>
              <p className="text-xs text-[#475569] mt-1">Closing your session securely</p>
            </div>
          </div>
        )}

        {state === 'logged-out' && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#0F172A]">Signed Out Successfully</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

