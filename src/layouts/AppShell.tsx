import type { ReactNode } from 'react'
import { Header } from '@/components/common'

export function AppShell({
  children,
  user,
  onNavigate,
  onLogout,
  activeSection = "",
}: {
  children: ReactNode
  user: { name: string; role: string; email: string }
  onNavigate: (s: any) => void
  onLogout: () => void
  activeSection?: string
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header user={user} onNavigate={onNavigate} onLogout={onLogout} />

      {/* Breadcrumb / page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
