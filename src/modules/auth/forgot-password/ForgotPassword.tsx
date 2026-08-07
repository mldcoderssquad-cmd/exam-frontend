import { AuthLayout } from '@/layouts'
import { useState } from 'react'
import { Button, Input, Alert, ArrowLeftIcon, MailIcon, CheckCircleIcon } from '@/components/common'

type FPState = 'default' | 'invalid-input' | 'user-not-found' | 'loading' | 'reset-sent' | 'error'

interface ForgotPasswordProps {
  onBack: () => void
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [state, setState] = useState<FPState>('default')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const validate = () => {
    if (!email) { setEmailError('Email is required'); setState('invalid-input'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email address'); setState('invalid-input'); return false }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    if (!validate()) return
    setState('loading')
    setTimeout(() => {
      // Demo: simulate user not found for specific email
      if (email === 'notfound@test.com') { setState('user-not-found'); return }
      if (email === 'error@test.com') { setState('error'); return }
      setState('reset-sent')
    }, 1400)
  }

  if (state === 'reset-sent') {
    return (
      <AuthLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-4">
              <CheckCircleIcon size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Check Your Email</h1>
            <p className="text-sm text-[#475569] mt-2 max-w-sm">
              Password reset instructions have been sent to:
            </p>
            <p className="text-sm font-semibold text-[#0F172A] mt-1">{email}</p>
            <p className="text-sm text-[#475569] mt-3 max-w-sm leading-relaxed">
              If an account with this email exists, you will receive a link to reset your password within the next few minutes. Check your spam folder if you don't see it.
            </p>
          </div>

          <Alert variant="info"
            message="For security reasons, the reset link will expire in 30 minutes. Do not share this link with anyone." />

          <div className="space-y-3">
            <Button variant="primary" size="lg" fullWidth onClick={() => { setState('default'); setEmail('') }}>
              Send Another Link
            </Button>
            <Button variant="ghost" size="lg" fullWidth onClick={onBack} leftIcon={<ArrowLeftIcon size={16} />}>
              Back to Sign In
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#1B3A6B] font-medium mb-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5DE8] rounded"
          >
            <ArrowLeftIcon size={14} /> Back to Sign In
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Reset Your Password</h1>
          <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">
            Enter your registered university email address. We will send password reset instructions to that address.
          </p>
        </div>

        {state === 'user-not-found' && (
          <Alert variant="warning" title="Account Not Found"
            message="We could not find an account associated with that email address. Please verify the email and try again, or contact your administrator." />
        )}
        {state === 'error' && (
          <Alert variant="error" title="Request Failed"
            message="We could not process your request due to a server error. Please try again in a few moments." />
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="University Email Address"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(''); if (state === 'invalid-input' || state === 'user-not-found') setState('default') }}
            error={emailError}
            required
            autoComplete="email"
            disabled={state === 'loading'}
            leftIcon={<MailIcon size={16} />}
            hint="Enter the email address associated with your ExamEvaluate account."
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={state === 'loading'}>
            {state === 'loading' ? 'Sending Instructions…' : 'Send Reset Instructions'}
          </Button>
        </form>

        <p className="text-xs text-center text-[#94A3B8]">
          Remember your password?{' '}
          <button onClick={onBack} className="text-[#3B5DE8] hover:underline font-medium">
            Sign in here
          </button>
        </p>

        {/* Demo states */}
        <div className="border-t border-[#E2E8F0] pt-4">
          <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide mb-2">Demo — Test States</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'User Not Found', email: 'notfound@test.com' },
              { label: 'Server Error', email: 'error@test.com' },
              { label: 'Success', email: 'faculty@university.edu' },
            ].map(({ label, email: e }) => (
              <button key={label} type="button"
                onClick={() => { setEmail(e); setState('default'); setEmailError('') }}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
