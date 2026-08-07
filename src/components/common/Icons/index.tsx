import type { ReactNode } from 'react'

function Icon({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  )
}
export function EyeOffIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </Icon>
  )
}
export function AlertCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </Icon>
  )
}
export function CheckCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Icon>
  )
}
export function AlertTriangleIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  )
}
export function InfoIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </Icon>
  )
}
export function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  )
}
export function CircleIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="10" />
    </Icon>
  )
}
export function XIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  )
}
export function UserIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  )
}
export function LockIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </Icon>
  )
}
export function LogOutIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Icon>
  )
}
export function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </Icon>
  )
}
export function ShieldIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Icon>
  )
}
export function KeyIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </Icon>
  )
}
export function EditIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Icon>
  )
}
export function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  )
}
export function ArrowLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </Icon>
  )
}
export function ErrorIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </Icon>
  )
}
export function ClockIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  )
}
export function BanIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </Icon>
  )
}
export function WifiOffIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
    </Icon>
  )
}
export function UsersIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </Icon>
  )
}
export function RefreshIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </Icon>
  )
}
export function HomeIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Icon>
  )
}
export function ChevronRightIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <polyline points="9 18 15 12 9 6" />
    </Icon>
  )
}
export function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  )
}
export function FilterIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </Icon>
  )
}
export function DownloadIcon({ size = 16 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Icon>
  )
}
