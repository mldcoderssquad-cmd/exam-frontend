import { useModal } from './useModal'

/**
 * Wraps the logout-confirmation-modal open/close state that was
 * previously duplicated (as `showLogout` + `setShowLogout`) across
 * FacultyDashboard, HODDashboard, DeanDashboard and AdminDashboard.
 */
export function useLogout() {
  const { isOpen: showLogout, open: openLogout, close: closeLogout } = useModal(false)
  return { showLogout, openLogout, closeLogout }
}
