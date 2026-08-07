import type { UserRole } from '@/types'

export const DASHBOARD_SCREEN_ROLE_MAP: Record<string, UserRole> = {
  'dashboard-faculty': 'Faculty',
  'dashboard-hod': 'HOD',
  'dashboard-dean': 'Dean',
  'dashboard-admin': 'Admin',
}
