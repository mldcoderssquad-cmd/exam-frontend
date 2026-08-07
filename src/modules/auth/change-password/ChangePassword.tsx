import { AppShell } from '@/layouts'
import { useState } from 'react'
import {
  Card, CardHeader, Button, PasswordInput, Alert, PasswordStrengthBar, Toast, CheckCircleIcon
} from '@/components/common'
import type { User, Screen } from '@/types'

type CPState = 'default' | 'validation-error' | 'wrong-current' | 'mismatch' | 'weak' | 'loading' | 'success' | 'error'

interface ChangePasswordProps {
  user: User
  onNavigate: (s: Screen) => void
  onLogout: () => void
  onBack: () => void
}

export default function ChangePassword({ user, onNavigate, onLogout, onBack }: ChangePasswordProps) {
  const [state, setState] = useState<CPState>('default')
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toastVisible, setToastVisible] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!current) errs.current = 'Current password is required'
    if (!newPass) errs.newPass = 'New password is required'
    if (!confirm) errs.confirm = 'Please confirm your new password'
    else if (newPass && newPass !== confirm) { errs.confirm = 'Passwords do not match'; setState('mismatch') }

    setErrors(errs)
    if (Object.keys(errs).length > 0) { if (!errs.confirm) setState('validation-error'); return }

    setState('loading')
    setTimeout(() => {
      if (current === 'wrong') { setState('wrong-current'); setErrors({ current: 'Current password is incorrect' }); return }
      if (current === 'error') { setState('error'); return }
      setState('success')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 3000)
    }, 1400)
  }

  if (state === 'success') {
    return (
      <AppShell
        user={{ name: user.name, role: user.role, email: user.email }}
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="max-w-lg mx-auto animate-fade-in">
          <Card className="text-center py-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                <CheckCircleIcon size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Password Changed Successfully</h2>
                <p className="text-sm text-[#475569] mt-2 max-w-xs mx-auto leading-relaxed">
                  Your password has been updated. You will need to use your new password the next time you sign in.
                </p>
              </div>
              <Alert variant="info"
                message="For security, all other active sessions have been signed out. Only your current session remains active."
                className="text-left" />
              <Button variant="primary" size="md" onClick={onBack}>
                Return to Profile
              </Button>
            </div>
          </Card>
        </div>
        <Toast message="Password changed successfully!" type="success" visible={toastVisible} />
      </AppShell>
    )
  }

  return (
    <AppShell
      user={{ name: user.name, role: user.role, email: user.email }}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <button onClick={onBack} className="hover:text-[#1B3A6B] transition-colors">My Profile</button>
          <span>/</span>
          <span className="text-[#0F172A] font-medium">Change Password</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Change Password</h1>
          <p className="text-sm text-[#475569] mt-0.5">Keep your account secure with a strong, unique password.</p>
        </div>

        {state === 'wrong-current' && (
          <Alert variant="error" title="Incorrect Password"
            message="The current password you entered is incorrect. Please try again. (Type 'wrong' to test)" />
        )}
        {state === 'mismatch' && (
          <Alert variant="error" title="Passwords Don't Match"
            message="Your new password and confirmation do not match. Please re-enter them." />
        )}
        {state === 'error' && (
          <Alert variant="error" title="Update Failed"
            message="An error occurred while updating your password. Please try again. (Type 'error' to test)" />
        )}

        <Card>
          <CardHeader title="Update Password" subtitle="Enter your current password and choose a new one" />
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              value={current}
              onChange={e => { setCurrent(e.target.value); setErrors(v => ({ ...v, current: '' })); if (state === 'wrong-current') setState('default') }}
              error={errors.current}
              required
              disabled={state === 'loading'}
              autoComplete="current-password"
              hint="Type 'wrong' to simulate incorrect current password"
            />

            <div>
              <PasswordInput
                label="New Password"
                placeholder="Create a strong password"
                value={newPass}
                onChange={e => { setNewPass(e.target.value); setErrors(v => ({ ...v, newPass: '' })) }}
                error={errors.newPass}
                required
                disabled={state === 'loading'}
                autoComplete="new-password"
              />
              <PasswordStrengthBar password={newPass} />
            </div>

            <PasswordInput
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setErrors(v => ({ ...v, confirm: '' })); if (state === 'mismatch') setState('default') }}
              error={errors.confirm}
              required
              disabled={state === 'loading'}
              autoComplete="new-password"
            />

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" size="md" fullWidth onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" fullWidth loading={state === 'loading'}>
                {state === 'loading' ? 'Updating…' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  )
}
