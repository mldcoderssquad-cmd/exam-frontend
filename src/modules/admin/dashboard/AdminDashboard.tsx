import { AppShell } from '@/layouts'
import { useEffect, useMemo, useState } from 'react'
import { useLogout } from '@/hooks'

import {
  Card,
  CardHeader,
  Button,
  Alert,
  Modal,
  Table,
  Th,
  Td,
  RoleBadge,
  StatusBadge,
  QuickAction,
  StatCard,
  HBarChart,
  DonutChart,
  ActivityTimeline,
  NotificationList,
  LogoutModal,
} from '@/components/common'

import type { User, Screen, UserRole } from '@/types'

import {
  Users,
  GraduationCap,
  Building2,
  Hourglass,
  BookOpen,
  Plus,
  UserPlus,
  Link,
  ClipboardList,
  Settings,
  Bot,
  FileSearch,
  RefreshCw,
} from 'lucide-react'

import {
  getAdminUsers,
  getAdminAuditLogs,
} from '@/services/admin/adminApi'

import {
  SYSTEM_HEALTH,
  DEPARTMENTS_ADMIN,
  ADMIN_NOTIFICATIONS,
  ADMIN_ACTIVITY,
  DEPT_LOAD,
} from '@/services/admin/mockData'

/* ============================================================
BACKEND TYPES
============================================================ */

interface BackendUser {
  id: string
  name: string
  email: string
  employeeId?: string
  role?: string
  status?: string
  department?: string
  designation?: string
}

interface BackendAuditLog {
  id: string
  actorId?: string
  actorRole?: string
  action?: string
  targetUserId?: string
  targetEmail?: string
  targetRole?: string
  details?: Record<string, unknown>
  timestamp?: string
}

/* ============================================================
HEALTH PILL
============================================================ */

function HealthPill({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status: string
}) {
  const dot =
    status === 'good'
      ? 'bg-[#059669]'
      : status === 'warn'
        ? 'bg-[#D97706]'
        : 'bg-[#DC2626]'

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full shrink-0 ${dot}`}
      />

      <div className="flex-1 min-w-0">
        <div className="text-xs text-[#94A3B8]">
          {label}
        </div>

        <div className="text-sm font-semibold text-[#0F172A] truncate">
          {value}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
ROLE NORMALIZER
============================================================ */

function normalizeRole(role?: string): string {
  if (!role) return 'Unknown'

  const value = role.toLowerCase()

  if (value === 'faculty') return 'Faculty'
  if (value === 'hod') return 'HOD'
  if (value === 'dean') return 'Dean'
  if (value === 'admin') return 'Admin'

  return role
}

/* ============================================================
STATUS NORMALIZER
============================================================ */

function normalizeStatus(status?: string): string {
  if (!status) return 'Unknown'

  const value = status.toLowerCase()

  if (value === 'active') return 'Active'
  if (value === 'suspended') return 'Suspended'
  if (value === 'inactive') return 'Inactive'
  if (value === 'pending') return 'Pending Activation'

  if (value === 'pending activation') {
    return 'Pending Activation'
  }

  if (value === 'locked') return 'Locked'

  return status
}

/* ============================================================
AUDIT ACTION DISPLAY
============================================================ */

function formatAuditAction(action?: string): string {
  if (!action) return 'Unknown Action'

  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/* ============================================================
AUDIT TYPE
============================================================ */

function getAuditType(
  action?: string
): 'success' | 'error' | 'warning' | 'info' {
  const value = action?.toUpperCase() || ''

  if (
    value.includes('DELETE') ||
    value.includes('SUSPEND')
  ) {
    return 'error'
  }

  if (
    value.includes('ACTIVATE') ||
    value.includes('CREATE') ||
    value.includes('UPDATE')
  ) {
    return 'success'
  }

  return 'info'
}

/* ============================================================
IST TIME FORMATTER
============================================================ */

/*
  Backend/MongoDB timestamps are normally returned as ISO
  timestamps such as:

  2026-08-09T12:32:00.000Z

  The "Z" means UTC.

  This formatter explicitly converts the timestamp to
  India Standard Time (IST) using Asia/Kolkata.

  This means the display will always use IST regardless of
  the user's/browser/system timezone.
*/

function formatAuditTime(timestamp?: string): string {
  if (!timestamp) return '—'

  try {
    let normalizedTimestamp = timestamp.trim()

    /*
      If the backend sends an ISO timestamp without timezone
      information, for example:

      2026-08-09T12:32:00

      JavaScript normally interprets this as browser-local time.

      If your backend stores these timestamps as UTC, append Z
      so they are correctly interpreted as UTC.
    */

    const hasTimezone =
      normalizedTimestamp.endsWith('Z') ||
      /[+-]\d{2}:\d{2}$/.test(normalizedTimestamp)

    if (!hasTimezone) {
      normalizedTimestamp += 'Z'
    }

    const date = new Date(normalizedTimestamp)

    if (Number.isNaN(date.getTime())) {
      return timestamp
    }

    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  } catch (error) {
    console.error(
      'AUDIT TIME FORMAT ERROR:',
      error
    )

    return timestamp
  }
}

/* ============================================================
ADMIN DASHBOARD
============================================================ */

interface AdminDashboardProps {
  user: User
  onNavigate: (s: Screen) => void
  onLogout: () => void
}

export default function AdminDashboard({
  user,
  onNavigate,
  onLogout,
}: AdminDashboardProps) {
  const {
    showLogout,
    openLogout,
    closeLogout,
  } = useLogout()

  /* ==========================================================
  STATE
  ========================================================== */

  const [users, setUsers] = useState<BackendUser[]>([])
  const [auditLogs, setAuditLogs] = useState<BackendAuditLog[]>([])

  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingLogs, setLoadingLogs] = useState(true)

  const [usersError, setUsersError] =
    useState<string | null>(null)

  const [logsError, setLogsError] =
    useState<string | null>(null)

  const [settingsModal, setSettingsModal] =
    useState<'ocr' | 'ai' | null>(null)

  const [ocrThreshold, setOcrThreshold] =
    useState('0.85')

  const [aiModel, setAiModel] =
    useState('gpt-4-turbo')

  /* ==========================================================
  LOAD USERS
  ========================================================== */

  const loadUsers = async () => {
    try {
      setLoadingUsers(true)
      setUsersError(null)

      const response = await getAdminUsers()

      setUsers(response.users || [])
    } catch (error) {
      console.error(
        'ADMIN DASHBOARD USERS ERROR:',
        error
      )

      setUsersError(
        error instanceof Error
          ? error.message
          : 'Unable to load users'
      )
    } finally {
      setLoadingUsers(false)
    }
  }

  /* ==========================================================
  LOAD AUDIT LOGS
  ========================================================== */

  const loadAuditLogs = async () => {
    try {
      setLoadingLogs(true)
      setLogsError(null)

      const response = await getAdminAuditLogs()

      setAuditLogs(response.logs || [])
    } catch (error) {
      console.error(
        'ADMIN DASHBOARD AUDIT LOG ERROR:',
        error
      )

      setLogsError(
        error instanceof Error
          ? error.message
          : 'Unable to load audit logs'
      )
    } finally {
      setLoadingLogs(false)
    }
  }

  /* ==========================================================
  INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    void loadUsers()
    void loadAuditLogs()
  }, [])

  /* ==========================================================
  USER STATISTICS
  ========================================================== */

  const totalUsers = users.length

  const activeUsers = users.filter(
    (u) =>
      normalizeStatus(u.status) === 'Active'
  ).length

  const activeFaculty = users.filter(
    (u) =>
      normalizeRole(u.role) === 'Faculty' &&
      normalizeStatus(u.status) === 'Active'
  ).length

  const pendingUsers = users.filter(
    (u) =>
      normalizeStatus(u.status) ===
      'Pending Activation'
  ).length

  const suspendedUsers = users.filter(
    (u) =>
      normalizeStatus(u.status) === 'Suspended'
  ).length

  /* ==========================================================
  ROLE DISTRIBUTION
  ========================================================== */

  const roleDistribution = useMemo(() => {
    const roles = [
      'Faculty',
      'HOD',
      'Dean',
      'Admin',
    ]

    return roles.map((role) => ({
      label: role,
      value: users.filter(
        (u) =>
          normalizeRole(u.role) === role
      ).length,
    }))
  }, [users])

  /* ==========================================================
  BACKEND AUDIT LOGS
  ========================================================== */

  const recentAuditLogs = useMemo(() => {
    return auditLogs.slice(0, 10)
  }, [auditLogs])

  /* ==========================================================
  REFRESH EVERYTHING
  ========================================================== */

  const refreshDashboard = async () => {
    await Promise.all([
      loadUsers(),
      loadAuditLogs(),
    ])
  }

  /* ==========================================================
  RENDER
  ========================================================== */

  return (
    <AppShell
      user={{
        name: user.name,
        role: user.role,
        email: user.email,
      }}
      onNavigate={onNavigate}
      onLogout={openLogout}
      activeSection="dashboard"
    >
      {/* ====================================================
          WELCOME BANNER
      ==================================================== */}

      <Card className="p-0 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#0F2142] via-[#1B3A6B] to-[#234E9A]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-blue-300 text-sm font-medium">
                System Administration
              </p>

              <h1 className="text-2xl font-bold text-white mt-0.5 tracking-tight">
                {user.name}
              </h1>

              <p className="text-blue-200 text-sm mt-1">
                {user.designation}
              </p>

              <div className="mt-3">
                <RoleBadge role={user.role} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={refreshDashboard}
                disabled={
                  loadingUsers || loadingLogs
                }
                leftIcon={
                  <RefreshCw
                    size={14}
                    className={
                      loadingUsers || loadingLogs
                        ? 'animate-spin'
                        : ''
                    }
                  />
                }
              >
                Refresh
              </Button>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-3 min-w-[90px]">
                  <div className="text-2xl font-bold text-white">
                    {loadingUsers
                      ? '…'
                      : totalUsers}
                  </div>

                  <div className="text-blue-300 text-xs mt-0.5">
                    Total Users
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 min-w-[90px]">
                  <div className="text-2xl font-bold text-white">
                    {DEPARTMENTS_ADMIN.length}
                  </div>

                  <div className="text-blue-300 text-xs mt-0.5">
                    Departments
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 min-w-[90px]">
                  <div className="text-2xl font-bold text-white">
                    {activeUsers}
                  </div>

                  <div className="text-blue-300 text-xs mt-0.5">
                    Active Users
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 min-w-[90px]">
                  <div className="text-2xl font-bold text-white">
                    {pendingUsers}
                  </div>

                  <div className="text-blue-300 text-xs mt-0.5">
                    Pending Activation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ====================================================
          ERROR
      ==================================================== */}

      {usersError && (
        <Alert
          variant="error"
          title="Unable to load users"
          message={usersError}
        />
      )}

      {logsError && (
        <Alert
          variant="error"
          title="Unable to load audit logs"
          message={logsError}
        />
      )}

      {/* ====================================================
          PENDING USERS
      ==================================================== */}

      {!loadingUsers && pendingUsers > 0 && (
        <div className="space-y-2">
          <Alert
            variant="warning"
            title={`${pendingUsers} Pending User Activations`}
            message="New user accounts are waiting for activation."
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              onNavigate('admin-users')
            }
          >
            Manage Users →
          </Button>
        </div>
      )}

      {/* ====================================================
          STATS
      ==================================================== */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Users"
          value={
            loadingUsers
              ? '...'
              : totalUsers
          }
          color="#1B3A6B"
          icon={<Users size={20} />}
        />

        <StatCard
          label="Active Faculty"
          value={
            loadingUsers
              ? '...'
              : activeFaculty
          }
          color="#3B5DE8"
          icon={<GraduationCap size={20} />}
        />

        <StatCard
          label="Departments"
          value={DEPARTMENTS_ADMIN.length}
          color="#7C3AED"
          icon={<Building2 size={20} />}
        />

        <StatCard
          label="Pending Requests"
          value={
            loadingUsers
              ? '...'
              : pendingUsers
          }
          color="#D97706"
          icon={<Hourglass size={20} />}
          trend={{
            direction: 'neutral',
            text: 'need activation',
          }}
        />

        <StatCard
          label="Courses"
          value={75}
          sub="across all depts"
          color="#059669"
          icon={<BookOpen size={20} />}
        />

        <StatCard
          label="Audit Events"
          value={
            loadingLogs
              ? '...'
              : auditLogs.length
          }
          sub="recent"
          color="#94A3B8"
          icon={<FileSearch size={20} />}
        />
      </div>

      {/* ====================================================
          QUICK ACTIONS
      ==================================================== */}

      <div>
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <QuickAction
            variant="column"
            icon={<Plus size={20} />}
            label="Add Faculty"
            sub="Create faculty account"
            onClick={() =>
              onNavigate('admin-create-user')
            }
            color="#1B3A6B"
          />

          <QuickAction
            variant="column"
            icon={<UserPlus size={20} />}
            label="Add HOD"
            sub="Assign department head"
            onClick={() =>
              onNavigate('admin-create-user')
            }
            color="#3B5DE8"
          />

          <QuickAction
            variant="column"
            icon={<GraduationCap size={20} />}
            label="Add Dean"
            sub="Create dean account"
            onClick={() =>
              onNavigate('admin-create-user')
            }
            color="#7C3AED"
          />

          <QuickAction
            variant="column"
            icon={<BookOpen size={20} />}
            label="Add Subject"
            sub="Register new subject"
            color="#0284C7"
          />

          <QuickAction
            variant="column"
            icon={<Link size={20} />}
            label="Assign Course"
            sub="Map faculty to course"
            color="#059669"
          />

          <QuickAction
            variant="column"
            icon={<ClipboardList size={20} />}
            label="Manage Users"
            sub="View all users"
            onClick={() =>
              onNavigate('admin-users')
            }
            color="#D97706"
          />

          <QuickAction
            variant="column"
            icon={<Settings size={20} />}
            label="OCR Settings"
            sub="Confidence & engine"
            onClick={() =>
              setSettingsModal('ocr')
            }
            color="#DC2626"
          />

          <QuickAction
            variant="column"
            icon={<Bot size={20} />}
            label="AI Settings"
            sub="Model & evaluation"
            onClick={() =>
              setSettingsModal('ai')
            }
            color="#059669"
          />
        </div>
      </div>

      {/* ====================================================
          MAIN CONTENT
      ==================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ==================================================
            LEFT CONTENT
        ================================================== */}

        <div className="xl:col-span-2 space-y-6">
          {/* USER MANAGEMENT SUMMARY */}

          <Card padding={false}>
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  User Management
                </h3>

                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Live user data from MongoDB
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  onNavigate('admin-users')
                }
              >
                Manage All Users →
              </Button>
            </div>

            {loadingUsers ? (
              <div className="p-10 text-center text-sm text-[#94A3B8]">
                Loading users...
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Role</Th>
                    <Th>Total</Th>
                    <Th>Active</Th>
                    <Th>Pending Activation</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>

                <tbody>
                  {roleDistribution.map(
                    (row) => {
                      const active =
                        users.filter(
                          (u) =>
                            normalizeRole(u.role) ===
                              row.label &&
                            normalizeStatus(
                              u.status
                            ) === 'Active'
                        ).length

                      const pending =
                        users.filter(
                          (u) =>
                            normalizeRole(u.role) ===
                              row.label &&
                            normalizeStatus(
                              u.status
                            ) ===
                              'Pending Activation'
                        ).length

                      return (
                        <tr
                          key={row.label}
                          className="hover:bg-[#F8FAFC]"
                        >
                          <Td>
                            <RoleBadge
                              role={
                                row.label as UserRole
                              }
                            />
                          </Td>

                          <Td>
                            <span className="text-sm font-bold text-[#0F172A]">
                              {row.value}
                            </span>
                          </Td>

                          <Td>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />

                              <span className="text-sm text-[#0F172A]">
                                {active}
                              </span>
                            </div>
                          </Td>

                          <Td>
                            {pending > 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E]">
                                {pending} pending
                              </span>
                            ) : (
                              <span className="text-xs text-[#94A3B8]">
                                —
                              </span>
                            )}
                          </Td>

                          <Td>
                            <button
                              onClick={() =>
                                onNavigate(
                                  'admin-users'
                                )
                              }
                              className="text-xs font-semibold text-[#3B5DE8] hover:text-[#1B3A6B]"
                            >
                              View →
                            </button>
                          </Td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </Table>
            )}
          </Card>

          {/* DEPARTMENT MANAGEMENT */}

          <Card padding={false}>
            <div className="p-5 border-b border-[#E2E8F0]">
              <h3 className="text-base font-semibold text-[#0F172A]">
                Department Overview
              </h3>

              <p className="text-xs text-[#94A3B8] mt-0.5">
                All registered departments
              </p>
            </div>

            <Table>
              <thead>
                <tr>
                  <Th>Code</Th>
                  <Th>Department</Th>
                  <Th>Faculty</Th>
                  <Th>Courses</Th>
                  <Th>Status</Th>
                </tr>
              </thead>

              <tbody>
                {DEPARTMENTS_ADMIN.map(
                  (dept) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-[#F8FAFC]"
                    >
                      <Td>
                        <span className="text-xs font-bold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                          {dept.code}
                        </span>
                      </Td>

                      <Td>
                        <span className="text-sm font-medium text-[#0F172A]">
                          {dept.name}
                        </span>
                      </Td>

                      <Td>
                        <span className="text-sm text-[#475569]">
                          {dept.faculty}
                        </span>
                      </Td>

                      <Td>
                        <span className="text-sm text-[#475569]">
                          {dept.courses}
                        </span>
                      </Td>

                      <Td>
                        <StatusBadge status="Active" />
                      </Td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </Card>

          {/* AUDIT LOGS */}

          <Card padding={false}>
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Audit Logs
                </h3>

                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Live admin activity from backend • IST
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={loadAuditLogs}
              >
                Refresh
              </Button>
            </div>

            {loadingLogs ? (
              <div className="p-10 text-center text-sm text-[#94A3B8]">
                Loading audit logs...
              </div>
            ) : recentAuditLogs.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#94A3B8]">
                No audit logs available.
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>User</Th>
                    <Th>Action</Th>
                    <Th>Resource</Th>
                    <Th>Time (IST)</Th>
                  </tr>
                </thead>

                <tbody>
                  {recentAuditLogs.map(
                    (log) => {
                      const auditType =
                        getAuditType(
                          log.action
                        )

                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-[#F8FAFC]"
                        >
                          <Td>
                            <div>
                              <div className="text-sm font-medium text-[#0F172A]">
                                {log.targetEmail ||
                                  log.actorId ||
                                  'System'}
                              </div>

                              <span className="text-xs text-[#94A3B8]">
                                {normalizeRole(
                                  log.targetRole ||
                                    log.actorRole
                                )}
                              </span>
                            </div>
                          </Td>

                          <Td>
                            <div className="flex items-center gap-1.5">
                              <div
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  auditType ===
                                  'success'
                                    ? 'bg-[#059669]'
                                    : auditType ===
                                        'error'
                                      ? 'bg-[#DC2626]'
                                      : 'bg-[#3B5DE8]'
                                }`}
                              />

                              <span className="text-sm text-[#475569]">
                                {formatAuditAction(
                                  log.action
                                )}
                              </span>
                            </div>
                          </Td>

                          <Td>
                            <span className="text-xs text-[#94A3B8] font-mono">
                              {log.targetUserId ||
                                '—'}
                            </span>
                          </Td>

                          <Td>
                            <span className="text-xs text-[#94A3B8]">
                              {formatAuditTime(
                                log.timestamp
                              )}
                            </span>
                          </Td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </Table>
            )}
          </Card>

          {/* CHARTS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader
                title="User Role Distribution"
                subtitle="Live backend user data"
              />

              <DonutChart
                segments={roleDistribution}
                centerValue={totalUsers}
                centerLabel="Total Users"
                size={120}
              />
            </Card>

            <Card>
              <CardHeader
                title="Faculty per Department"
                subtitle="Current department overview"
              />

              <HBarChart data={DEPT_LOAD} />
            </Card>
          </div>
        </div>

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <div className="space-y-6">
          {/* SYSTEM HEALTH */}

          <Card>
            <CardHeader
              title="System Health"
              subtitle="System status"
            />

            <div className="grid grid-cols-1 gap-2">
              {SYSTEM_HEALTH.map(
                (s) => (
                  <HealthPill
                    key={s.label}
                    {...s}
                  />
                )
              )}
            </div>
          </Card>

          {/* USER STATUS SUMMARY */}

          <Card>
            <CardHeader
              title="Account Status"
              subtitle="Live MongoDB data"
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#475569]">
                  Active
                </span>

                <span className="text-sm font-bold text-[#059669]">
                  {activeUsers}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-[#475569]">
                  Pending
                </span>

                <span className="text-sm font-bold text-[#D97706]">
                  {pendingUsers}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-[#475569]">
                  Suspended
                </span>

                <span className="text-sm font-bold text-[#DC2626]">
                  {suspendedUsers}
                </span>
              </div>
            </div>
          </Card>

          {/* SETTINGS */}

          <Card>
            <CardHeader title="System Settings" />

            <div className="space-y-2">
              <button
                onClick={() =>
                  setSettingsModal('ocr')
                }
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                  <Settings
                    size={18}
                    className="text-[#DC2626]"
                  />
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-[#0F172A]">
                    OCR Settings
                  </div>

                  <div className="text-xs text-[#94A3B8]">
                    Threshold: {ocrThreshold}
                  </div>
                </div>

                <span className="text-xs text-[#94A3B8]">
                  →
                </span>
              </button>

              <button
                onClick={() =>
                  setSettingsModal('ai')
                }
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <Bot
                    size={18}
                    className="text-[#059669]"
                  />
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-[#0F172A]">
                    AI Evaluation
                  </div>

                  <div className="text-xs text-[#94A3B8]">
                    Model: {aiModel}
                  </div>
                </div>

                <span className="text-xs text-[#94A3B8]">
                  →
                </span>
              </button>
            </div>
          </Card>

          {/* NOTIFICATIONS */}

          <Card>
            <CardHeader
              title="Notifications"
              subtitle={`${ADMIN_NOTIFICATIONS.length} updates`}
            />

            <NotificationList
              items={ADMIN_NOTIFICATIONS}
            />
          </Card>

          {/* RECENT ACTIVITY */}

          <Card>
            <CardHeader title="Recent Activity" />

            <ActivityTimeline
              events={ADMIN_ACTIVITY}
              maxItems={5}
            />
          </Card>
        </div>
      </div>

      {/* ======================================================
          LOGOUT
      ====================================================== */}

      <LogoutModal
        open={showLogout}
        onClose={closeLogout}
        onConfirm={onLogout}
      />

      {/* ======================================================
          OCR SETTINGS MODAL
      ====================================================== */}

      {settingsModal === 'ocr' && (
        <Modal
          open
          onClose={() =>
            setSettingsModal(null)
          }
          maxWidth="max-w-md"
        >
          <div className="p-6 space-y-5">
            <h3 className="text-lg font-bold text-[#0F172A]">
              OCR Engine Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                  Confidence Threshold
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={ocrThreshold}
                    onChange={(e) =>
                      setOcrThreshold(
                        e.target.value
                      )
                    }
                    className="flex-1 accent-[#1B3A6B]"
                  />

                  <span className="w-12 text-center text-sm font-bold text-[#1B3A6B] bg-[#EEF4FF] px-2 py-1 rounded-lg">
                    {ocrThreshold}
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] mt-1">
                  Minimum confidence for
                  auto-accepted OCR results.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                  OCR Engine Status
                </label>

                <div className="flex items-center gap-2 p-2.5 bg-[#D1FAE5] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#059669]" />

                  <span className="text-sm text-[#065F46] font-medium">
                    Online and operational
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                  Auto-advance Delay
                </label>

                <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A]">
                  <option>
                    2 seconds (fast)
                  </option>

                  <option>
                    3 seconds (default)
                  </option>

                  <option>
                    5 seconds (careful)
                  </option>

                  <option>
                    Manual only
                  </option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() =>
                  setSettingsModal(null)
                }
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() =>
                  setSettingsModal(null)
                }
              >
                Save Settings
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================
          AI SETTINGS MODAL
      ====================================================== */}

      {settingsModal === 'ai' && (
        <Modal
          open
          onClose={() =>
            setSettingsModal(null)
          }
          maxWidth="max-w-md"
        >
          <div className="p-6 space-y-5">
            <h3 className="text-lg font-bold text-[#0F172A]">
              AI Evaluation Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                  AI Model
                </label>

                <select
                  value={aiModel}
                  onChange={(e) =>
                    setAiModel(
                      e.target.value
                    )
                  }
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A]"
                >
                  <option value="gpt-4-turbo">
                    GPT-4 Turbo
                  </option>

                  <option value="gpt-4">
                    GPT-4
                  </option>

                  <option value="claude-3-opus">
                    Claude 3 Opus
                  </option>

                  <option value="claude-3-sonnet">
                    Claude 3 Sonnet
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                  Evaluation Mode
                </label>

                <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A]">
                  <option>
                    Strict (marks within ±5%)
                  </option>

                  <option>
                    Standard (marks within ±10%)
                  </option>

                  <option>
                    Lenient (faculty override preferred)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                  AI Service Status
                </label>

                <div className="flex items-center gap-2 p-2.5 bg-[#D1FAE5] rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#059669]" />

                  <span className="text-sm text-[#065F46] font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() =>
                  setSettingsModal(null)
                }
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() =>
                  setSettingsModal(null)
                }
              >
                Save Settings
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppShell>
  )
}
