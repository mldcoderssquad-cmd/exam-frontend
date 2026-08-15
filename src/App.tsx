// src/App.tsx

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
<<<<<<< Updated upstream
=======
import AnswerKeyManager from '@/modules/answer-key/AnswerKeyManager'

>>>>>>> Stashed changes
import { SessionExpired } from '@/modules/auth/session-expired'
import { UnauthorizedAccess } from '@/modules/auth/unauthorized'

export default function App() {
<<<<<<< Updated upstream
  const { screen, previousScreen, navigate } = useNavigation('login')
  const { currentUser, login, logout, saveProfile } = useAuth()

  const handleLoginSuccess = (role: UserRole) => {
    login(role)
    navigate(`dashboard-${role.toLowerCase()}` as Screen)
  }

=======

  const {
    screen,
    previousScreen,
    navigate,
  } = useNavigation('login')

  const {
    currentUser,
    setUser,
    logout,
    saveProfile,
  } = useAuth()

  /*
   * ============================================================
   * LOGIN SUCCESS
   * ============================================================
   */

  const handleLoginSuccess = (role: UserRole) => {

    const savedUser = getSavedUser()

    if (!savedUser) {
      console.error(
        'Login succeeded but authenticated user was not found in localStorage.'
      )

      navigate('login')
      return
    }

    setUser(savedUser)

    switch (role) {

      case 'Faculty':
        navigate('dashboard-faculty')
        break

      case 'HOD':
        navigate('dashboard-hod')
        break

      case 'Dean':
        navigate('dashboard-dean')
        break

      case 'Admin':
        navigate('dashboard-admin')
        break

      default:
        console.error(
          'Unknown user role:',
          role
        )

        navigate('unauthorized')
    }
  }

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

>>>>>>> Stashed changes
  const handleLogout = () => {
    logout()
    navigate('login')
  }

<<<<<<< Updated upstream
  const handleSaveProfile = (updates: Partial<User>) => {
    saveProfile(updates)
  }

  const getDashboardScreenForUser = () => {
    if (!currentUser) return 'login'
    return getDashboardScreen(currentUser.role) as Screen
  }

  // ─── Screens without authenticated user ────────────────────────────────────
=======
  /*
   * ============================================================
   * SAVE PROFILE
   * ============================================================
   */

  const handleSaveProfile = (
    updates: Partial<User>
  ) => {
    saveProfile(updates)
  }

  /*
   * ============================================================
   * DASHBOARD SCREEN FOR CURRENT USER
   * ============================================================
   */

  const getDashboardScreenForUser = (): Screen => {

    if (!currentUser) {
      return 'login'
    }

    return getDashboardScreen(
      currentUser.role
    ) as Screen
  }

  /*
   * ============================================================
   * LOGIN SCREEN
   * ============================================================
   */

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * FORGOT PASSWORD
   * ============================================================
   */

>>>>>>> Stashed changes
  if (screen === 'forgot-password') {
    return <ForgotPassword onBack={() => navigate('login')} />
  }

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * RESET PASSWORD
   * ============================================================
   */

>>>>>>> Stashed changes
  if (screen === 'reset-password') {
    return <ResetPassword onBackToLogin={() => navigate('login')} />
  }

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * ACCOUNT ACTIVATION
   * ============================================================
   */

>>>>>>> Stashed changes
  if (screen === 'account-activation') {
    return <AccountActivation onBackToLogin={() => navigate('login')} />
  }

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * SESSION EXPIRED
   * ============================================================
   */

>>>>>>> Stashed changes
  if (screen === 'session-expired') {
    return <SessionExpired onReturnToLogin={() => navigate('login')} />
  }

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * UNAUTHORIZED
   * ============================================================
   */

>>>>>>> Stashed changes
  if (screen === 'unauthorized') {
    return (
      <UnauthorizedAccess
        onReturnToDashboard={() => navigate(getDashboardScreenForUser())}
        onGoBack={() => navigate(previousScreen)}
        userRole={currentUser?.role}
      />
    )
  }

<<<<<<< Updated upstream
  // ─── Screens requiring authenticated user ──────────────────────────────────
=======
  /*
   * ============================================================
   * AUTHENTICATION GUARD
   * ============================================================
   */

>>>>>>> Stashed changes
  if (!currentUser) {
    return <Login onSuccess={handleLoginSuccess} onForgotPassword={() => navigate('forgot-password')} />
  }

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * USER PROFILE
   * ============================================================
   */

>>>>>>> Stashed changes
  if (screen === 'profile') {
    return (
      <UserProfile
        user={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * EDIT PROFILE
   * ============================================================
   */

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * CHANGE PASSWORD
   * ============================================================
   */

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  /*
   * ============================================================
   * ANSWER KEY MANAGEMENT
   * ============================================================
   */

  if (screen === 'answer-key-create' || screen === 'answer-key-list') {
    return (
      <AnswerKeyManager
        user={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
        initialScreen={screen === 'answer-key-list' ? 'list' : 'create'}
      />
    )
  }

  /*
   * ============================================================
   * OCR WORKFLOW
   * ============================================================
   */

>>>>>>> Stashed changes
  if (screen === 'ocr-workflow') {
    return (
      <OCRWorkflow
        user={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

<<<<<<< Updated upstream
  if (screen === 'admin-users' || screen === 'admin-create-user') {
=======
  /*
   * ============================================================
   * ADMIN USER MANAGEMENT
   * ============================================================
   */

  if (
    screen === 'admin-users' ||
    screen === 'admin-create-user'
  ) {

>>>>>>> Stashed changes
    return (
      <AdminUserManagement
        currentUser={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

<<<<<<< Updated upstream
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
=======
  /*
   * ============================================================
   * ROLE-SPECIFIC DASHBOARDS
   * ============================================================
   */

  if (
    screen in DASHBOARD_SCREEN_ROLE_MAP
  ) {

    const viewRole =
      DASHBOARD_SCREEN_ROLE_MAP[screen]

    if (
      viewRole !== currentUser.role
    ) {

      return (
        <UnauthorizedAccess
          onReturnToDashboard={() =>
            navigate(
              getDashboardScreenForUser()
            )
          }

          onGoBack={() =>
            navigate(previousScreen)
          }

          userRole={currentUser.role}
        />
      )
    }

    const dashProps = {
      user: currentUser,
      onNavigate: navigate,
      onLogout: handleLogout,
    }

    if (
      screen === 'dashboard-faculty'
    ) {

      return (
        <FacultyDashboard
          {...dashProps}
        />
      )
    }

    if (
      screen === 'dashboard-hod'
    ) {

      return (
        <HODDashboard
          {...dashProps}
        />
      )
    }

    if (
      screen === 'dashboard-dean'
    ) {

      return (
        <DeanDashboard
          {...dashProps}
        />
      )
    }

    if (
      screen === 'dashboard-admin'
    ) {

      return (
        <AdminDashboard
          {...dashProps}
        />
      )
    }
  }

  /*
   * ============================================================
   * FINAL FALLBACK
   * ============================================================
   */

  return (
    <Login
      onSuccess={handleLoginSuccess}

      onForgotPassword={() =>
        navigate('forgot-password')
      }

      onActivateAccount={() =>
        navigate('account-activation')
      }

      onSessionExpired={() =>
        navigate('session-expired')
      }
    />
  )
}
>>>>>>> Stashed changes
