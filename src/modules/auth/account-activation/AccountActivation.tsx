import { AuthLayout } from '@/layouts'
import { useState } from 'react'
import { Button, Input, PasswordInput, Alert, PasswordStrengthBar, CheckCircleIcon, ArrowLeftIcon } from '@/components/common'

type ActivationStep = 'welcome' | 'verify' | 'set-password' | 'success'
type VerifyState = 'default' | 'invalid' | 'expired' | 'loading' | 'error'
type PasswordState = 'default' | 'mismatch' | 'weak' | 'loading' | 'error'

interface AccountActivationProps {
  onBackToLogin: () => void
}

export default function AccountActivation({ onBackToLogin }: AccountActivationProps) {
  const [step, setStep] = useState<ActivationStep>('welcome')
  const [verifyState, setVerifyState] = useState<VerifyState>('default')
  const [passwordState, setPasswordState] = useState<PasswordState>('default')

  const [email, setEmail] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [activationCode, setActivationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!email) errs.email = 'University email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address'
    if (!employeeId) errs.employeeId = 'Employee ID is required'
    if (!activationCode) errs.activationCode = 'Activation code is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) { setVerifyState('invalid'); return }

    setVerifyState('loading')
    setTimeout(() => {
      if (activationCode === 'EXPIRED') { setVerifyState('expired'); return }
      if (activationCode === 'ERROR') { setVerifyState('error'); return }
      setStep('set-password')
    }, 1400)
  }

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!newPassword) errs.newPassword = 'Password is required'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (newPassword !== confirmPassword) { errs.confirmPassword = 'Passwords do not match'; setPasswordState('mismatch') }
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setPasswordState('loading')
    setTimeout(() => {
      setStep('success')
    }, 1400)
  }

  if (step === 'welcome') {
    return (
      <AuthLayout
        panel={
          <div className="text-white">
            <h2 className="font-['DM_Serif_Display'] text-3xl mb-4">Welcome to the<br />Examination Platform</h2>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              Your account has been created by a university administrator. Complete the activation process to gain access.
            </p>
            <div className="space-y-3">
              {['Step 1: Verify your identity', 'Step 2: Set a secure password', 'Step 3: Access your dashboard'].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3B5DE8] text-white text-xs flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-blue-100 text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Activate Your Account</h1>
            <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">
              Your account has been set up by an authorized university administrator. Activate your account using the credentials provided to you.
            </p>
          </div>

          <Alert variant="info" title="Invitation-Only Access"
            message="ExamEvaluate accounts cannot be self-registered. Your account was created by your institution's system administrator. Check your university email for your activation code." />

          <div className="p-5 rounded-xl bg-[#EEF4FF] border border-[#BACFFB] space-y-2">
            <p className="text-sm font-semibold text-[#1B3A6B]">Before you begin, have the following ready:</p>
            <ul className="space-y-1">
              {['Your university email address', 'Your employee/faculty ID', 'The activation code from your welcome email'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#1B3A6B]">
                  <span className="text-[#3B5DE8]">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={() => setStep('verify')}>
            Begin Account Activation
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={onBackToLogin} leftIcon={<ArrowLeftIcon size={16} />}>
            Back to Sign In
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (step === 'verify') {
    return (
      <AuthLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex gap-1">
              {(['verify', 'set-password', 'success'] as ActivationStep[]).map((s, i) => (
                <div key={s} className={`h-1 rounded-full transition-all ${step === s ? 'w-8 bg-[#1B3A6B]' : i < (['verify', 'set-password', 'success'] as ActivationStep[]).indexOf(step) ? 'w-8 bg-[#059669]' : 'w-4 bg-[#E2E8F0]'}`} />
              ))}
            </div>
            <span className="text-xs text-[#94A3B8] ml-1">Step 1 of 3</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Verify Your Identity</h1>
            <p className="text-sm text-[#475569] mt-1.5">Enter the details from your administrator-issued welcome email.</p>
          </div>

          {verifyState === 'invalid' && (
            <Alert variant="error" title="Verification Failed"
              message="The details you entered do not match our records. Please check your email, employee ID, and activation code." />
          )}
          {verifyState === 'expired' && (
            <Alert variant="warning" title="Activation Code Expired"
              message="Your activation code has expired. Please contact your system administrator for a new activation email. Type 'EXPIRED' to test." />
          )}
          {verifyState === 'error' && (
            <Alert variant="error" title="Activation Error"
              message="A system error occurred. Please try again or contact support." />
          )}

          <form onSubmit={handleVerify} noValidate className="space-y-4">
            <Input label="University Email Address" type="email" placeholder="you@university.edu"
              value={email} onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })); setVerifyState('default') }}
              error={errors.email} required disabled={verifyState === 'loading'} />

            <Input label="Employee / Faculty ID" placeholder="e.g. EMP-2024-001"
              value={employeeId} onChange={e => { setEmployeeId(e.target.value); setErrors(v => ({ ...v, employeeId: '' })); setVerifyState('default') }}
              error={errors.employeeId} required disabled={verifyState === 'loading'} />

            <Input label="Activation Code" placeholder="Enter your activation code"
              value={activationCode} onChange={e => { setActivationCode(e.target.value.toUpperCase()); setErrors(v => ({ ...v, activationCode: '' })); setVerifyState('default') }}
              error={errors.activationCode} required disabled={verifyState === 'loading'}
              hint="Found in your administrator welcome email. (Type EXPIRED to test expired state)" />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={verifyState === 'loading'}>
              {verifyState === 'loading' ? 'Verifying…' : 'Verify & Continue'}
            </Button>
          </form>

          <Button variant="ghost" size="md" fullWidth onClick={onBackToLogin} leftIcon={<ArrowLeftIcon size={16} />}>
            Back to Sign In
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (step === 'set-password') {
    return (
      <AuthLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex gap-1">
              <div className="h-1 w-8 rounded-full bg-[#059669]" />
              <div className="h-1 w-8 rounded-full bg-[#1B3A6B]" />
              <div className="h-1 w-4 rounded-full bg-[#E2E8F0]" />
            </div>
            <span className="text-xs text-[#94A3B8] ml-1">Step 2 of 3</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Set Your Password</h1>
            <p className="text-sm text-[#475569] mt-1.5">Create a strong, unique password to secure your account.</p>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]">
            <span className="font-semibold text-[#0F172A]">Activating account for:</span> {email}
            <span className="mx-2 text-[#CBD5E1]">·</span>
            <span className="font-semibold text-[#0F172A]">Employee ID:</span> {employeeId}
          </div>

          {passwordState === 'mismatch' && (
            <Alert variant="error" title="Passwords Don't Match" message="Please re-enter your passwords carefully." />
          )}
          {passwordState === 'error' && (
            <Alert variant="error" title="Activation Failed" message="Failed to set your password. Please try again." />
          )}

          <form onSubmit={handleSetPassword} noValidate className="space-y-4">
            <div>
              <PasswordInput label="New Password" placeholder="Create a strong password"
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                error={errors.newPassword} required disabled={passwordState === 'loading'}
                autoComplete="new-password" />
              <PasswordStrengthBar password={newPassword} />
            </div>

            <PasswordInput label="Confirm Password" placeholder="Re-enter your password"
              value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setErrors(v => ({ ...v, confirmPassword: '' })); setPasswordState('default') }}
              error={errors.confirmPassword} required disabled={passwordState === 'loading'}
              autoComplete="new-password" />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={passwordState === 'loading'}>
              {passwordState === 'loading' ? 'Activating Account…' : 'Activate My Account'}
            </Button>
          </form>
        </div>
      </AuthLayout>
    )
  }

  // success
  return (
    <AuthLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-4">
            <CheckCircleIcon size={32} />
          </div>
          <div className="flex gap-1 mb-4">
            {[0, 1, 2].map(i => <div key={i} className="h-1 w-8 rounded-full bg-[#059669]" />)}
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Account Activated!</h1>
          <p className="text-sm text-[#475569] mt-2 max-w-sm leading-relaxed">
            Your account has been successfully activated. You can now sign in to ExamEvaluate using your university email and the password you just set.
          </p>
        </div>

        <Alert variant="success"
          message="Welcome aboard! Your account is ready. Sign in to access your dashboard and begin working." />

        <Button variant="primary" size="lg" fullWidth onClick={onBackToLogin} leftIcon={<ArrowLeftIcon size={16} />}>
          Sign In to Your Account
        </Button>
      </div>
    </AuthLayout>
  )
}
