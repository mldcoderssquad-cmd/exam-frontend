import { AppShell } from '@/layouts'
import { useState } from 'react'
import {
  Card, CardHeader, Button, Input, Alert, Toast, Table, Th, Td, StatusBadge, RoleBadge, Modal
} from '@/components/common'
import type { User, UserRole, AccountStatus, Screen, AdminUserRecord } from '@/types'
import { MOCK_ADMIN_USERS } from '@/services/admin'
import { useSearch } from '@/hooks'
import { PlusIcon, SearchIcon, FilterIcon, EditIcon, UserIcon, RefreshIcon, BanIcon, DownloadIcon } from '@/components/common'


type AdminView = 'list' | 'create' | 'details'

interface AdminUserManagementProps {
  currentUser: User
  onNavigate: (s: Screen) => void
  onLogout: () => void
}

export default function AdminUserManagement({ currentUser, onNavigate, onLogout }: AdminUserManagementProps) {
  const [view, setView] = useState<AdminView>('list')
  const [users, setUsers] = useState<AdminUserRecord[]>(MOCK_ADMIN_USERS)
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null)
  const { search, setSearch } = useSearch('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'All'>('All')

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.employeeId.toLowerCase().includes(q)
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    const matchStatus = statusFilter === 'All' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  if (view === 'create') {
    return <CreateUserForm currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} onSuccess={(u) => { setUsers(v => [u, ...v]); setView('list') }} onCancel={() => setView('list')} />
  }

  if (view === 'details' && selectedUser) {
    return <UserDetails user={selectedUser} currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} onBack={() => setView('list')} onStatusChange={(id, status) => setUsers(v => v.map(u => u.id === id ? { ...u, status } : u))} />
  }

  return (
    <AppShell
      user={{ name: currentUser.name, role: currentUser.role, email: currentUser.email }}
      onNavigate={onNavigate}
      onLogout={onLogout}
      activeSection="admin-users"
    >
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#94A3B8] mb-1">
              <button onClick={() => onNavigate('dashboard-admin')} className="hover:text-[#1B3A6B] transition-colors">Dashboard</button>
              <span>/</span>
              <span className="text-[#0F172A] font-medium">User Management</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">User Management</h1>
            <p className="text-sm text-[#475569] mt-0.5">{users.length} total users · {users.filter(u => u.status === 'Active').length} active</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setView('create')} leftIcon={<PlusIcon size={16} />}>
            Create User
          </Button>
        </div>

        {/* Filters */}
        <Card className="py-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-48">
              <Input
                placeholder="Search by name, email, or employee ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<SearchIcon size={16} />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as UserRole | 'All')}
                className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] bg-white focus:border-[#3B5DE8] focus:ring-2 focus:ring-[#3B5DE8]/20 outline-none"
              >
                <option value="All">All Roles</option>
                {(['Faculty', 'HOD', 'Dean', 'Admin'] as UserRole[]).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as AccountStatus | 'All')}
                className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] bg-white focus:border-[#3B5DE8] focus:ring-2 focus:ring-[#3B5DE8]/20 outline-none"
              >
                <option value="All">All Statuses</option>
                {(['Active', 'Pending Activation', 'Inactive', 'Suspended', 'Locked'] as AccountStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card padding={false}>
          <Table>
            <thead>
              <tr>
                <Th>User</Th>
                <Th>Employee ID</Th>
                <Th>Department</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#94A3B8] text-sm">
                    No users match your search criteria.
                  </td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#3B5DE8] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0F172A]">{u.name}</div>
                        <div className="text-xs text-[#94A3B8]">{u.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><span className="font-mono text-xs text-[#475569]">{u.employeeId}</span></Td>
                  <Td><span className="text-sm text-[#475569]">{u.department}</span></Td>
                  <Td><RoleBadge role={u.role} /></Td>
                  <Td><StatusBadge status={u.status} /></Td>
                  <Td><span className="text-xs text-[#94A3B8]">{u.createdDate}</span></Td>
                  <Td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setSelectedUser(u); setView('details') }}
                        className="px-2.5 py-1 rounded-md text-xs font-medium text-[#1B3A6B] bg-[#EEF4FF] hover:bg-[#BACFFB] transition-colors"
                      >
                        View
                      </button>
                      {u.status === 'Pending Activation' && (
                        <button
                          onClick={() => setUsers(v => v.map(x => x.id === u.id ? { ...x, status: 'Active' } : x))}
                          className="px-2.5 py-1 rounded-md text-xs font-medium text-[#065F46] bg-[#D1FAE5] hover:bg-[#A7F3D0] transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </AppShell>
  )
}

// ─── Create User Form ─────────────────────────────────────────────────────────
type CreateState = 'default' | 'validation-error' | 'saving' | 'success' | 'error'

function CreateUserForm({ currentUser, onNavigate, onLogout, onSuccess, onCancel }: {
  currentUser: User; onNavigate: (s: Screen) => void; onLogout: () => void
  onSuccess: (u: AdminUserRecord) => void; onCancel: () => void
}) {
  const [state, setState] = useState<CreateState>('default')
  const [toastVisible, setToastVisible] = useState(false)
  const [fields, setFields] = useState({
    name: '', email: '', employeeId: '', phone: '', department: '', designation: '',
    role: 'Faculty' as UserRole, status: 'Pending Activation' as AccountStatus,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: string) => { setFields(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!fields.name.trim()) errs.name = 'Full name is required'
    if (!fields.email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = 'Enter a valid email address'
    if (!fields.employeeId.trim()) errs.employeeId = 'Employee ID is required'
    if (!fields.department.trim()) errs.department = 'Department is required'
    if (!fields.designation.trim()) errs.designation = 'Designation is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) { setState('validation-error'); return }

    setState('saving')
    setTimeout(() => {
      const newUser: AdminUserRecord = {
        id: String(Date.now()),
        ...fields,
        lastLogin: '—',
        createdDate: new Date().toISOString().split('T')[0],
      }
      setState('success')
      setToastVisible(true)
      setTimeout(() => { onSuccess(newUser) }, 1200)
    }, 1400)
  }

  return (
    <AppShell
      user={{ name: currentUser.name, role: currentUser.role, email: currentUser.email }}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-2 text-sm text-[#94A3B8] mb-1">
          <button onClick={() => onNavigate('dashboard-admin')} className="hover:text-[#1B3A6B] transition-colors">Dashboard</button>
          <span>/</span>
          <button onClick={onCancel} className="hover:text-[#1B3A6B] transition-colors">User Management</button>
          <span>/</span>
          <span className="text-[#0F172A] font-medium">Create User</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Create New User</h1>
          <p className="text-sm text-[#475569] mt-0.5">
            Create an institutional account for a faculty member, HOD, Dean, or admin. The user will receive an activation email.
          </p>
        </div>

        <Alert variant="info" title="Administrator-Controlled Registration"
          message="User accounts cannot be self-registered. Only authorized administrators may create accounts on this platform. A welcome email with activation instructions will be sent to the provided email address." />

        {state === 'validation-error' && (
          <Alert variant="error" title="Validation Error" message="Please correct the errors below before creating the account." />
        )}
        {state === 'error' && (
          <Alert variant="error" title="Creation Failed" message="The user account could not be created. Please try again." />
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <Card>
            <CardHeader title="Personal Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="Dr. First Last" value={fields.name} onChange={e => set('name', e.target.value)} error={errors.name} required disabled={state === 'saving'} className="sm:col-span-2" />
              <Input label="University Email" type="email" placeholder="user@university.edu" value={fields.email} onChange={e => set('email', e.target.value)} error={errors.email} required disabled={state === 'saving'} />
              <Input label="Employee ID" placeholder="EMP-2025-XXX" value={fields.employeeId} onChange={e => set('employeeId', e.target.value)} error={errors.employeeId} required disabled={state === 'saving'} />
              <Input label="Phone Number" type="tel" placeholder="+91 XXXXXXXXXX" value={fields.phone} onChange={e => set('phone', e.target.value)} disabled={state === 'saving'} hint="Optional" />
            </div>
          </Card>

          <Card>
            <CardHeader title="Institutional Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Department" placeholder="e.g. Computer Science" value={fields.department} onChange={e => set('department', e.target.value)} error={errors.department} required disabled={state === 'saving'} />
              <Input label="Designation" placeholder="e.g. Associate Professor" value={fields.designation} onChange={e => set('designation', e.target.value)} error={errors.designation} required disabled={state === 'saving'} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0F172A]">Role <span className="text-[#DC2626]">*</span></label>
                <select
                  value={fields.role}
                  onChange={e => set('role', e.target.value)}
                  disabled={state === 'saving'}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] bg-white focus:border-[#3B5DE8] focus:ring-2 focus:ring-[#3B5DE8]/20 outline-none disabled:bg-[#F8FAFC] disabled:text-[#94A3B8]"
                >
                  {(['Faculty', 'HOD', 'Dean', 'Admin'] as UserRole[]).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0F172A]">Initial Status</label>
                <select
                  value={fields.status}
                  onChange={e => set('status', e.target.value)}
                  disabled={state === 'saving'}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] bg-white focus:border-[#3B5DE8] focus:ring-2 focus:ring-[#3B5DE8]/20 outline-none disabled:bg-[#F8FAFC] disabled:text-[#94A3B8]"
                >
                  <option value="Pending Activation">Pending Activation</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" loading={state === 'saving'} leftIcon={<UserIcon size={14} />}>
              {state === 'saving' ? 'Creating User…' : 'Create User & Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
      <Toast message="User created successfully! Invitation email sent." type="success" visible={toastVisible} />
    </AppShell>
  )
}

// ─── User Details ─────────────────────────────────────────────────────────────
function UserDetails({ user, currentUser, onNavigate, onLogout, onBack, onStatusChange }: {
  user: AdminUserRecord; currentUser: User; onNavigate: (s: Screen) => void; onLogout: () => void
  onBack: () => void; onStatusChange: (id: string, status: AccountStatus) => void
}) {
  const [confirmModal, setConfirmModal] = useState<{ action: string; newStatus: AccountStatus } | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  const handleStatusChange = (action: string, newStatus: AccountStatus) => {
    setConfirmModal(null)
    onStatusChange(user.id, newStatus)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  return (
    <AppShell
      user={{ name: currentUser.name, role: currentUser.role, email: currentUser.email }}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <button onClick={() => onNavigate('dashboard-admin')} className="hover:text-[#1B3A6B]">Dashboard</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-[#1B3A6B]">User Management</button>
          <span>/</span>
          <span className="text-[#0F172A] font-medium">{user.name}</span>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#0F2142] to-[#1B3A6B] text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#3B5DE8] border-2 border-white/20 flex items-center justify-center text-white text-xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-blue-200 text-sm">{user.designation} · {user.department}</p>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={user.status} />
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 flex flex-wrap gap-2 border-t border-[#E2E8F0]">
            {user.status === 'Pending Activation' && (
              <button onClick={() => setConfirmModal({ action: 'Activate', newStatus: 'Active' })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#065F46] bg-[#D1FAE5] hover:bg-[#A7F3D0] transition-colors">
                Activate Account
              </button>
            )}
            {user.status === 'Active' && (
              <button onClick={() => setConfirmModal({ action: 'Deactivate', newStatus: 'Inactive' })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#92400E] bg-[#FEF3C7] hover:bg-[#FDE68A] transition-colors">
                Deactivate
              </button>
            )}
            {(user.status === 'Active' || user.status === 'Inactive') && (
              <button onClick={() => setConfirmModal({ action: 'Suspend', newStatus: 'Suspended' })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#991B1B] bg-[#FEE2E2] hover:bg-[#FECACA] transition-colors">
                Suspend
              </button>
            )}
            {user.status === 'Suspended' && (
              <button onClick={() => setConfirmModal({ action: 'Reinstate', newStatus: 'Active' })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#065F46] bg-[#D1FAE5] hover:bg-[#A7F3D0] transition-colors">
                Reinstate
              </button>
            )}
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#475569] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors flex items-center gap-1.5">
              <RefreshIcon size={12} /> Reset Password
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Account Details" />
            <dl className="space-y-3">
              {[
                { label: 'Full Name', value: user.name },
                { label: 'University Email', value: user.email },
                { label: 'Employee ID', value: user.employeeId },
                { label: 'Phone', value: user.phone || '—' },
              ].map(f => (
                <div key={f.label}>
                  <dt className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">{f.label}</dt>
                  <dd className="mt-0.5 text-sm text-[#0F172A]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <CardHeader title="Institutional Details" />
            <dl className="space-y-3">
              {[
                { label: 'Department', value: user.department },
                { label: 'Designation', value: user.designation },
                { label: 'Created', value: user.createdDate },
                { label: 'Last Login', value: user.lastLogin },
              ].map(f => (
                <div key={f.label}>
                  <dt className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">{f.label}</dt>
                  <dd className="mt-0.5 text-sm text-[#0F172A]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      {confirmModal && (
        <Modal open onClose={() => setConfirmModal(null)}>
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">{confirmModal.action} Account?</h3>
            <p className="text-sm text-[#475569]">
              Are you sure you want to {confirmModal.action.toLowerCase()} the account for <strong>{user.name}</strong>?
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="md" fullWidth onClick={() => setConfirmModal(null)}>Cancel</Button>
              <Button variant={confirmModal.action === 'Suspend' ? 'danger' : 'primary'} size="md" fullWidth
                onClick={() => handleStatusChange(confirmModal.action, confirmModal.newStatus)}>
                {confirmModal.action}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Toast message={`Account status updated successfully.`} type="success" visible={toastVisible} />
    </AppShell>
  )
}
