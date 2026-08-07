import { AuthLayout } from '@/layouts'
import { useState } from 'react'
import { Button, PasswordInput, Alert, PasswordStrengthBar, getPasswordStrength, CheckCircleIcon, ArrowLeftIcon } from '@/components/common'

type RPState = 'default' | 'typing' | 'strong' | 'weak' | 'mismatch' | 'invalid-link' | 'loading' | 'success' | 'error'

interface ResetPasswordProps {
  onBackToLogin: () => void
  linkValid?: boolean
}

export default function ResetPassword({ onBackToLogin, linkValid = true }: ResetPasswordProps) {
  const [state, setState] = useState<RPState>(linkValid ? 'default' : 'invalid-link')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newError, setNewError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setNewPassword(val)
    setNewError('')
    if (val) {
      const strength = getPasswordStrength(val)
      setState(strength.score >= 4 ? 'strong' : 'typing')
    } else {
      setState('default')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewError('')
    setConfirmError('')
    let valid = true

    if (!newPassword) { setNewError('New password is required'); valid = false }
    else {
      const strength = getPasswordStrength(newPassword)
      if (strength.score < 3) { setNewError('Password is too weak. Choose a stronger password.'); setState('weak'); valid = false }
    }
    if (!confirmPassword) { setConfirmError('Please confirm your new password'); valid = false }
    else if (newPassword !== confirmPassword) { setConfirmError('Passwords do not match'); setState('mismatch'); valid = false }

    if (!valid) return
    setState('loading')
    setTimeout(() => {
      if (newPassword === 'error123!') { setState('error'); return }
      setState('success')
    }, 1400)
  }

  if (state === 'invalid-link') {
    return (
      <AuthLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Link Expired or Invalid</h1>
            <p className="text-sm text-[#475569] mt-2 max-w-sm leading-relaxed">
              This password reset link is either expired or has already been used. Reset links are valid for 30 minutes only.
            </p>
          </div>
          <Alert variant="warning" title="Security Notice"
            message="For your security, reset links expire after 30 minutes and can only be used once." />
          <Button variant="primary" size="lg" fullWidth onClick={onBackToLogin}>
            Request a New Reset Link
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (state === 'success') {
    return (
      <AuthLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-4">
              <CheckCircleIcon size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Password Reset Successful</h1>
            <p className="text-sm text-[#475569] mt-2 max-w-sm leading-relaxed">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
          </div>
          <Alert variant="success"
            message="Your account security has been updated. All other active sessions have been signed out." />
          <Button variant="primary" size="lg" fullWidth onClick={onBackToLogin} leftIcon={<ArrowLeftIcon size={16} />}>
            Return to Sign In
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Set New Password</h1>
          <p className="text-sm text-[#475569] mt-1.5">
            Choose a strong, unique password for your account. Do not reuse passwords from other accounts.
          </p>
        </div>

        {state === 'mismatch' && (
          <Alert variant="error" title="Passwords Don't Match"
            message="The passwords you entered do not match. Please re-enter them carefully." />
        )}
        {state === 'weak' && (
          <Alert variant="warning" title="Weak Password"
            message="Your password does not meet the minimum security requirements. Please choose a stronger password." />
        )}
        {state === 'error' && (
          <Alert variant="error" title="Reset Failed"
            message="An error occurred while resetting your password. Please try again or request a new reset link." />
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <PasswordInput
              label="New Password"
              placeholder="Create a strong password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={newError}
              required
              autoComplete="new-password"
              disabled={state === 'loading'}
            />
            <PasswordStrengthBar password={newPassword} />
          </div>

          <PasswordInput
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); setConfirmError('') }}
            error={confirmError}
            required
            autoComplete="new-password"
            disabled={state === 'loading'}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={state === 'loading'}>
            {state === 'loading' ? 'Resetting Password…' : 'Reset Password'}
          </Button>
        </form>

        <button
          onClick={onBackToLogin}
          className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#1B3A6B] font-medium transition-colors mx-auto"
        >
          <ArrowLeftIcon size={14} /> Back to Sign In
        </button>

        {/* Demo */}
        <div className="border-t border-[#E2E8F0] pt-4">
          <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide mb-2">Demo — Test States</p>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setState('invalid-link')}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#DC2626] hover:text-[#DC2626] transition-all">
              Expired Link
            </button>
            <button onClick={() => setState('success')}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#059669] hover:text-[#059669] transition-all">
              Success
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
