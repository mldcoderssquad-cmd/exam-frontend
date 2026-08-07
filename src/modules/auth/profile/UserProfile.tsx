import { AppShell } from '@/layouts'
import { useState } from 'react'
import {
  Card, CardHeader, Button, StatusBadge, RoleBadge, FieldGroup, SectionLabel, Modal
} from '@/components/common'
import type { User, Screen } from '@/types'
import { EditIcon, LockIcon, LogOutIcon, UserIcon, ShieldIcon, ClockIcon } from '@/components/common'

interface UserProfileProps {
  user: User
  onNavigate: (s: Screen) => void
  onLogout: () => void
}

export default function UserProfile({ user, onNavigate, onLogout }: UserProfileProps) {
  const [showLogout, setShowLogout] = useState(false)

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <AppShell
      user={{ name: user.name, role: user.role, email: user.email }}
      onNavigate={onNavigate}
      onLogout={() => setShowLogout(true)}
      activeSection="profile"
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <button onClick={() => onNavigate(`dashboard-${user.role.toLowerCase()}` as Screen)} className="hover:text-[#1B3A6B] transition-colors">
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#0F172A] font-medium">My Profile</span>
        </div>

        {/* Hero card */}
        <Card className="p-0 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#0F2142] via-[#1B3A6B] to-[#3B5DE8]" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-[#3B5DE8] border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {initials}
              </div>
              <div className="pb-1 flex-1 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-[#0F172A]">{user.name}</h1>
                  <p className="text-sm text-[#475569]">{user.designation} · {user.department}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={user.status} />
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm" onClick={() => onNavigate('edit-profile')} leftIcon={<EditIcon size={14} />}>
                Edit Profile
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onNavigate('change-password')} leftIcon={<LockIcon size={14} />}>
                Change Password
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowLogout(true)} leftIcon={<LogOutIcon size={14} />}>
                Sign Out
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card>
            <CardHeader title="Personal Information" subtitle="Your editable profile details" />
            <SectionLabel>Contact Details</SectionLabel>
            <dl className="grid grid-cols-1 gap-4 mb-6">
              <FieldGroup label="Full Name" value={user.name} />
              <FieldGroup label="Phone Number" value={user.phone || '—'} />
            </dl>
          </Card>

          {/* System Info (read-only) */}
          <Card>
            <CardHeader title="System Information"
              subtitle={
                <span className="flex items-center gap-1 text-[#94A3B8] text-xs">
                  <ShieldIcon size={12} /> Read-only · Managed by Administrator
                </span>
              }
            />
            <dl className="grid grid-cols-1 gap-4">
              <FieldGroup label="University Email" value={
                <span className="flex items-center gap-1.5 text-[#475569]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  {user.email}
                </span>
              } />
              <FieldGroup label="Employee ID" value={user.employeeId} />
              <FieldGroup label="Department" value={user.department} />
              <FieldGroup label="Designation" value={user.designation} />
              <FieldGroup label="Role" value={<RoleBadge role={user.role} />} />
              <FieldGroup label="Account Status" value={<StatusBadge status={user.status} />} />
              <FieldGroup label="Last Login" value={
                <span className="flex items-center gap-1.5 text-[#475569]">
                  <ClockIcon size={12} /> {user.lastLogin}
                </span>
              } />
            </dl>
          </Card>
        </div>

        {/* Security note */}
        <Card className="bg-[#EEF4FF] border-[#BACFFB]">
          <div className="flex items-start gap-3">
            <ShieldIcon size={18} />
            <div>
              <p className="text-sm font-semibold text-[#1B3A6B]">Account Security</p>
              <p className="text-xs text-[#475569] mt-0.5">
                Your role, department, and university email are managed by your system administrator and cannot be changed here.
                Contact your administrator if any system information is incorrect.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Logout modal */}
      <Modal open={showLogout} onClose={() => setShowLogout(false)}>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
              <LogOutIcon size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Sign Out</h3>
              <p className="text-sm text-[#475569] mt-1">
                Are you sure you want to sign out of ExamEvaluate? Any unsaved work may be lost.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" fullWidth onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="danger" size="md" fullWidth onClick={onLogout} leftIcon={<LogOutIcon size={14} />}>Sign Out</Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
