export function getDashboardScreen(role: string): string {
  return `dashboard-${role.toLowerCase()}`
}

export function getHomeScreen(role: string): string {
  return getDashboardScreen(role)
}
