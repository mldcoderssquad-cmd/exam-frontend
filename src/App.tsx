import type { User, UserRole, Screen } from '@/types'
import { MOCK_USERS } from '@/services'
import { getDashboardScreen } from '@/utils'
import { useAuth, useNavigation } from '@/hooks'
import { DASHBOARD_SCREEN_ROLE_MAP } from '@/constants'

import Login from '@/modules/auth/login/Login'
import ForgotPassword from '@/modules/auth/forgot-password/ForgotPassword'
import ResetPassword from '@/modules/auth/reset-password/ResetPassword'
import AccountActivation from '@/modules/auth/account-activation/AccountActivation'
import UserProfile from '@/modules/auth/profile/UserProfile'
import EditProfile from '@/modules/auth/edit-profile/EditProfile'
import ChangePassword from '@/modules/auth/change-password/ChangePassword'
import FacultyDashboard from '@/modules/faculty/dashboard/FacultyDashboard'
import HODDashboard from '@/modules/hod/dashboard/HODDashboard'
import DeanDashboard from '@/modules/dean/dashboard/DeanDashboard'
import AdminDashboard from '@/modules/admin/dashboard/AdminDashboard'
import AdminUserManagement from '@/modules/admin/user-management/AdminUserManagement'
import OCRWorkflow from '@/modules/ocr/OCRWorkflow'
import { SessionExpired } from '@/modules/auth/session-expired'
import { UnauthorizedAccess } from '@/modules/auth/unauthorized'

export default function App() {
  const { screen, previousScreen, navigate } = useNavigation('login')
  const { currentUser, login, logout, saveProfile } = useAuth()

  const handleLoginSuccess = (role: UserRole) => {
    login(role)
    navigate(`dashboard-${role.toLowerCase()}` as Screen)
  }

  const handleLogout = () => {
    logout()
    navigate('login')
  }

  const handleSaveProfile = (updates: Partial<User>) => {
    saveProfile(updates)
  }

  const getDashboardScreenForUser = () => {
    if (!currentUser) return 'login'
    return getDashboardScreen(currentUser.role) as Screen
  }

  // ─── Screens without authenticated user ────────────────────────────────────
  if (screen === 'login') {
    return (
      <Login
        onSuccess={handleLoginSuccess}
        onForgotPassword={() => navigate('forgot-password')}
        onActivateAccount={() => navigate('account-activation')}
        onSessionExpired={() => navigate('session-expired')}
      />
    )
  }

  if (screen === 'forgot-password') {
    return <ForgotPassword onBack={() => navigate('login')} />
  }

  if (screen === 'reset-password') {
    return <ResetPassword onBackToLogin={() => navigate('login')} />
  }

  if (screen === 'account-activation') {
    return <AccountActivation onBackToLogin={() => navigate('login')} />
  }

  if (screen === 'session-expired') {
    return <SessionExpired onReturnToLogin={() => navigate('login')} />
  }

  if (screen === 'unauthorized') {
    return (
      <UnauthorizedAccess
        onReturnToDashboard={() => navigate(getDashboardScreenForUser())}
        onGoBack={() => navigate(previousScreen)}
        userRole={currentUser?.role}
      />
    )
  }

  // ─── Screens requiring authenticated user ──────────────────────────────────
  if (!currentUser) {
    return <Login onSuccess={handleLoginSuccess} onForgotPassword={() => navigate('forgot-password')} />
  }

  if (screen === 'profile') {
    return (
      <UserProfile
        user={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  if (screen === 'edit-profile') {
    return (
      <EditProfile
        user={currentUser}
        onSave={handleSaveProfile}
        onCancel={() => navigate('profile')}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  if (screen === 'change-password') {
    return (
      <ChangePassword
        user={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
        onBack={() => navigate('profile')}
      />
    )
  }

  if (screen === 'ocr-workflow') {
    return (
      <OCRWorkflow
        user={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  if (screen === 'admin-users' || screen === 'admin-create-user') {
    return (
      <AdminUserManagement
        currentUser={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  // Role-specific dashboards
  if (screen in DASHBOARD_SCREEN_ROLE_MAP) {
    const viewRole = DASHBOARD_SCREEN_ROLE_MAP[screen]
    const viewUser = viewRole === currentUser.role ? currentUser : { ...MOCK_USERS[viewRole] }
    const dashProps = { user: viewUser, onNavigate: navigate, onLogout: handleLogout }

    if (screen === 'dashboard-faculty') return <FacultyDashboard {...dashProps} />
    if (screen === 'dashboard-hod') return <HODDashboard {...dashProps} />
    if (screen === 'dashboard-dean') return <DeanDashboard {...dashProps} />
    if (screen === 'dashboard-admin') return <AdminDashboard {...dashProps} />
  }

  // Fallback
  return <Login onSuccess={handleLoginSuccess} onForgotPassword={() => navigate('forgot-password')} />
}
