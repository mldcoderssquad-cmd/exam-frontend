import { AuthLayout } from '@/layouts'
import { useState } from 'react'
import { Button, Input, PasswordInput, Alert, ShieldIcon, CheckCircleIcon } from '@/components/common'
import type { UserRole } from '@/types'

type LoginState =
  | 'default'
  | 'validation-error'
  | 'invalid-credentials'
  | 'loading'
  | 'success'
  | 'account-locked'
  | 'account-disabled'
  | 'session-expired'
  | 'network-error'

interface LoginProps {
  onSuccess: (role: UserRole) => void
  onForgotPassword: () => void
  onActivateAccount?: () => void
  onSessionExpired?: () => void
  initialState?: LoginState
}

export default function Login({ onSuccess, onForgotPassword, onActivateAccount, onSessionExpired, initialState = 'default' }: LoginProps) {
  const [loginState, setLoginState] = useState<LoginState>(initialState)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Demo: state selector for showcase
  const [demoRole, setDemoRole] = useState<UserRole>('Faculty')

  const validate = () => {
    let valid = true
    setEmailError('')
    setPasswordError('')
    if (!email) { setEmailError('Email or username is required'); valid = false }
    else if (!email.includes('@') && email.length < 3) { setEmailError('Enter a valid email or username'); valid = false }
    if (!password) { setPasswordError('Password is required'); valid = false }
    else if (password.length < 3) { setPasswordError('Password must be at least 8 characters'); valid = false }
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) { setLoginState('validation-error'); return }
    setLoginState('loading')
    setTimeout(() => {
      // Demo: simulate success
      if (password === 'wrong') { setLoginState('invalid-credentials'); return }
      if (password === 'locked') { setLoginState('account-locked'); return }
      if (password === 'disabled') { setLoginState('account-disabled'); return }
      setLoginState('success')
      setTimeout(() => onSuccess(demoRole), 800)
    }, 1400)
  }

  return (
    <AuthLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Sign in to your account</h1>
          <p className="text-sm text-[#475569] mt-1.5">
            Access the secure examination evaluation portal. Authorized personnel only.
          </p>
        </div>

        {/* State alerts */}
        {loginState === 'session-expired' && (
          <Alert variant="warning" title="Session Expired"
            message="Your session has timed out due to inactivity. Please sign in again to continue." />
        )}
        {loginState === 'invalid-credentials' && (
          <Alert variant="error" title="Invalid Credentials"
            message="The email or password you entered is incorrect. Please check your credentials and try again." />
        )}
        {loginState === 'account-locked' && (
          <Alert variant="error" title="Account Locked"
            message="Your account has been locked after multiple failed login attempts. Contact your administrator to unlock it." />
        )}
        {loginState === 'account-disabled' && (
          <Alert variant="error" title="Account Disabled"
            message="Your account has been disabled. Please contact your system administrator for assistance." />
        )}
        {loginState === 'network-error' && (
          <Alert variant="error" title="Connection Error"
            message="Unable to reach the server. Please check your internet connection and try again." />
        )}
        {loginState === 'success' && (
          <Alert variant="success" title="Signing In…"
            message="Authentication successful. Redirecting to your dashboard…" />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="University Email / Username"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError('') }}
            error={emailError}
            required
            autoComplete="email"
            leftIcon={<MailInputIcon />}
            disabled={loginState === 'loading' || loginState === 'success'}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => { setPassword(e.target.value); setPasswordError('') }}
            error={passwordError}
            required
            autoComplete="current-password"
            disabled={loginState === 'loading' || loginState === 'success'}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E2E8F0] text-[#1B3A6B] focus:ring-[#3B5DE8]"
              />
              <span className="text-sm text-[#475569] group-hover:text-[#0F172A] transition-colors">
                Remember me
              </span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#3B5DE8] hover:text-[#1B3A6B] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5DE8] rounded"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loginState === 'loading'}
            disabled={loginState === 'success'}
          >
            {loginState === 'loading' ? 'Signing In…' : loginState === 'success' ? 'Redirecting…' : 'Sign In'}
          </Button>
        </form>

        {/* Security notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#EEF4FF] border border-[#BACFFB]">
          <ShieldIcon size={14} />
          <p className="text-xs text-[#1B3A6B]">
            <strong>Secure System Notice:</strong> This is a restricted examination management system. All access is logged and monitored. Unauthorized access is strictly prohibited.
          </p>
        </div>

        {/* Demo state switcher */}
        <div className="border-t border-[#E2E8F0] pt-4">
          <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide mb-2">Demo — Select Role to Test</p>
          <div className="flex flex-wrap gap-1.5">
            {(['Faculty', 'HOD', 'Dean', 'Admin'] as UserRole[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setDemoRole(r)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                  demoRole === r
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                    : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#1B3A6B] hover:text-[#1B3A6B]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {([
              { label: 'Locked', state: 'account-locked' },
              { label: 'Disabled', state: 'account-disabled' },
              { label: 'Session Expired', state: 'session-expired' },
              { label: 'Network Error', state: 'network-error' },
            ] as { label: string; state: LoginState }[]).map(({ label, state }) => (
              <button
                key={label}
                type="button"
                onClick={() => setLoginState(state)}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setLoginState('default')}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#059669] hover:text-[#059669] transition-all"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {onActivateAccount && (
              <button
                type="button"
                onClick={onActivateAccount}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all"
              >
                Account Activation Flow →
              </button>
            )}
            {onSessionExpired && (
              <button
                type="button"
                onClick={onSessionExpired}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#D97706] hover:text-[#D97706] transition-all"
              >
                Session Expired Screen →
              </button>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

function MailInputIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
