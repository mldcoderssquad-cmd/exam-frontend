import { AppShell } from '@/layouts'
import { useState } from 'react'
import {
  Card, CardHeader, Button, Input, Alert, Toast, StatusBadge, RoleBadge, SectionLabel, ArrowLeftIcon
} from '@/components/common'
import type { User, Screen } from '@/types'

function SaveIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

type EditState = 'default' | 'editing' | 'saving' | 'success' | 'error'

interface EditProfileProps {
  user: User
  onSave: (updates: Partial<User>) => void
  onCancel: () => void
  onNavigate: (s: Screen) => void
  onLogout: () => void
}

export default function EditProfile({ user, onSave, onCancel, onNavigate, onLogout }: EditProfileProps) {
  const [state, setState] = useState<EditState>('default')
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [nameError, setNameError] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const isDirty = name !== user.name || phone !== user.phone

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setNameError('Full name is required'); return }
    setState('saving')
    setTimeout(() => {
      onSave({ name: name.trim(), phone })
      setState('success')
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 3000)
    }, 1200)
  }

  return (
    <AppShell
      user={{ name: user.name, role: user.role, email: user.email }}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <button onClick={onCancel} className="hover:text-[#1B3A6B] transition-colors">My Profile</button>
          <span>/</span>
          <span className="text-[#0F172A] font-medium">Edit Profile</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Edit Profile</h1>
            <p className="text-sm text-[#475569] mt-0.5">Update your personal contact information.</p>
          </div>
          <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#1B3A6B] font-medium transition-colors">
            <ArrowLeftIcon size={14} /> Back
          </button>
        </div>

        {state === 'error' && (
          <Alert variant="error" title="Update Failed" message="Your changes could not be saved. Please try again." />
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Editable section */}
          <Card>
            <CardHeader title="Editable Information" subtitle="These fields can be updated by you" />
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={e => { setName(e.target.value); setNameError(''); setState('editing') }}
                error={nameError}
                required
                placeholder="Your full name"
                disabled={state === 'saving'}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setState('editing') }}
                placeholder="+91 XXXXXXXXXX"
                hint="Optional. Used for institutional communications."
                disabled={state === 'saving'}
              />
            </div>
          </Card>

          {/* Read-only section */}
          <Card className="bg-[#F8FAFC]">
            <CardHeader title="System-Managed Information"
              subtitle={
                <span className="text-xs text-[#94A3B8]">
                  These fields are managed by your administrator and cannot be edited here.
                </span>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="University Email" value={user.email} disabled readOnly />
              <Input label="Employee ID" value={user.employeeId} disabled readOnly />
              <Input label="Department" value={user.department} disabled readOnly />
              <Input label="Designation" value={user.designation} disabled readOnly />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0F172A]">Role</label>
                <div className="h-10 flex items-center px-3 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0]">
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0F172A]">Account Status</label>
                <div className="h-10 flex items-center px-3 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0]">
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" size="md" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={state === 'saving'}
              disabled={!isDirty && state !== 'default'}
              leftIcon={state !== 'saving' ? <SaveIcon size={14} /> : undefined}
            >
              {state === 'saving' ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      <Toast message="Profile updated successfully!" type="success" visible={toastVisible} />
    </AppShell>
  )
}
