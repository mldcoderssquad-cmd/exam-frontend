import { AppShell } from '@/layouts'
import { useState } from 'react'
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
} from '@/components/common'
import {
  StatCard,
  HBarChart,
  DonutChart,
  ActivityTimeline,
  NotificationList,
} from '@/components/common'
import type { User, Screen, UserRole } from '@/types'
import { LogoutModal } from '@/components/common'

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
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────
import {
  SYSTEM_HEALTH,
  DEPARTMENTS_ADMIN,
  USERS_SUMMARY,
  AUDIT_LOGS,
  ADMIN_NOTIFICATIONS,
  ADMIN_ACTIVITY,
  ROLE_DIST,
  DEPT_LOAD,
} from '@/services/admin/mockData'

// ─── Health Indicator ─────────────────────────────────────────────────────────
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
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
      <div className={`w-2 h-2 rounded-full ${dot}`} />

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

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
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

  const [settingsModal, setSettingsModal] =
    useState<'ocr' | 'ai' | null>(null)

  const [ocrThreshold, setOcrThreshold] =
    useState('0.85')

  const [aiModel, setAiModel] =
    useState('gpt-4-turbo')

  const totalUsers =
    USERS_SUMMARY.reduce(
      (s, u) => s + u.count,
      0
    )

  const pendingUsers =
    USERS_SUMMARY.reduce(
      (s, u) => s + u.pending,
      0
    )

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
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

        {/* ── Welcome Banner ──────────────────────────────────── */}
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

              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  {
                    label: 'Total Users',
                    value: totalUsers,
                  },
                  {
                    label: 'Departments',
                    value: DEPARTMENTS_ADMIN.length,
                  },
                  {
                    label: 'Active Sessions',
                    value: 37,
                  },
                  {
                    label: 'Pending Activation',
                    value: pendingUsers,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/10 rounded-xl p-3"
                  >
                    <div className="text-2xl font-bold text-white">
                      {s.value}
                    </div>

                    <div className="text-blue-300 text-xs mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </Card>

        {/* ── Alert ───────────────────────────────────────────── */}
        {pendingUsers > 0 && (
          <div className="space-y-2">
            <Alert
              variant="warning"
              title={`${pendingUsers} Pending User Activations`}
              message="New faculty accounts have been created and are waiting for activation before they can access the platform."
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

        {/* ── Stats ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

          <StatCard
            label="Total Users"
            value={totalUsers}
            color="#1B3A6B"
            icon={<Users size={20} />}
          />

          <StatCard
            label="Active Faculty"
            value={42}
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
            value={pendingUsers}
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
            value={AUDIT_LOGS.length}
            sub="today"
            color="#94A3B8"
            icon={<FileSearch size={20} />}
          />

        </div>

        {/* ── Quick Actions ────────────────────────────────────── */}
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

        {/* ── Main Content ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 space-y-6">

            {/* User Management Summary */}
            <Card padding={false}>
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    User Management
                  </h3>

                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Role breakdown across the institution
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
                  {USERS_SUMMARY.map((row) => (
                    <tr
                      key={row.role}
                      className="hover:bg-[#F8FAFC]"
                    >
                      <Td>
                        <RoleBadge role={row.role} />
                      </Td>

                      <Td>
                        <span className="text-sm font-bold text-[#0F172A]">
                          {row.count}
                        </span>
                      </Td>

                      <Td>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />

                          <span className="text-sm text-[#0F172A]">
                            {row.active}
                          </span>
                        </div>
                      </Td>

                      <Td>
                        {row.pending > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E]">
                            {row.pending} pending
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
                            onNavigate('admin-users')
                          }
                          className="text-xs font-semibold text-[#3B5DE8] hover:text-[#1B3A6B]"
                        >
                          View →
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            {/* Department Management */}
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
                  {DEPARTMENTS_ADMIN.map((dept) => (
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
                  ))}
                </tbody>
              </Table>
            </Card>

            {/* Audit Logs */}
            <Card padding={false}>
              <div className="p-5 border-b border-[#E2E8F0]">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Audit Logs
                </h3>

                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Recent system-wide activity
                </p>
              </div>

              <Table>
                <thead>
                  <tr>
                    <Th>User</Th>
                    <Th>Action</Th>
                    <Th>Resource</Th>
                    <Th>Time</Th>
                  </tr>
                </thead>

                <tbody>
                  {AUDIT_LOGS.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-[#F8FAFC]"
                    >
                      <Td>
                        <div>
                          <div className="text-sm font-medium text-[#0F172A]">
                            {log.user}
                          </div>

                          <RoleBadge
                            role={log.role as UserRole}
                          />
                        </div>
                      </Td>

                      <Td>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.type === 'success'
                              ? 'bg-[#059669]'
                              : log.type === 'error'
                                ? 'bg-[#DC2626]'
                                : log.type === 'warning'
                                  ? 'bg-[#D97706]'
                                  : 'bg-[#3B5DE8]'
                              }`}
                          />

                          <span className="text-sm text-[#475569]">
                            {log.action}
                          </span>
                        </div>
                      </Td>

                      <Td>
                        <span className="text-xs text-[#94A3B8] font-mono">
                          {log.resource}
                        </span>
                      </Td>

                      <Td>
                        <span className="text-xs text-[#94A3B8]">
                          {log.time}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <Card>
                <CardHeader
                  title="User Role Distribution"
                  subtitle="All registered users"
                />

                <DonutChart
                  segments={ROLE_DIST}
                  centerValue={totalUsers}
                  centerLabel="Total Users"
                  size={120}
                />
              </Card>

              <Card>
                <CardHeader
                  title="Faculty per Department"
                  subtitle="Current faculty count"
                />

                <HBarChart data={DEPT_LOAD} />
              </Card>

            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* System Health */}
            <Card>
              <CardHeader
                title="System Health"
                subtitle="Live status"
              />

              <div className="grid grid-cols-1 gap-2">
                {SYSTEM_HEALTH.map((s) => (
                  <HealthPill
                    key={s.label}
                    {...s}
                  />
                ))}
              </div>
            </Card>

            {/* Settings Quick Access */}
            <Card>
              <CardHeader title="System Settings" />

              <div className="space-y-2">

                <button
                  onClick={() =>
                    setSettingsModal('ocr')
                  }
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-sm">
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
                  <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center text-sm">
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

            {/* Notifications */}
            <Card>
              <CardHeader
                title="Notifications"
                subtitle={`${ADMIN_NOTIFICATIONS.length} updates`}
              />

              <NotificationList
                items={ADMIN_NOTIFICATIONS}
              />
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader title="Recent Activity" />

              <ActivityTimeline
                events={ADMIN_ACTIVITY}
                maxItems={5}
              />
            </Card>

          </div>
        </div>
      </div>

      <LogoutModal
        open={showLogout}
        onClose={closeLogout}
        onConfirm={onLogout}
      />

      {/* OCR Settings Modal */}
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
                  Minimum confidence for auto-accepted OCR results. Lower = more auto-accept, higher = more human review.
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

                <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#3B5DE8]">
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

      {/* AI Settings Modal */}
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
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#3B5DE8]"
                >
                  <option value="gpt-4-turbo">
                    GPT-4 Turbo (Recommended)
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

                <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#3B5DE8]">
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
                    Online · v2.3.1 (updated 5h ago)
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