import type { User } from '@/types'
import { StatusBadge } from '../StatusBadge'
import { RoleBadge } from '../RoleBadge'

export function ProfileCard({ user, initials }: { user: User; initials: string }) {
  return (
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
  )
}
