// Mock data for the Admin dashboard (placeholder until a real API is wired in)
import type { UserRole } from '@/types'

export const SYSTEM_HEALTH = [
  { label: 'API Response', value: '98ms', status: 'good' },
  { label: 'DB Load', value: '42%', status: 'good' },
  { label: 'OCR Engine', value: 'Online', status: 'good' },
  { label: 'AI Service', value: 'Online', status: 'good' },
  { label: 'Storage', value: '61% used', status: 'warn' },
  { label: 'Sessions', value: '37 active', status: 'good' },
]

export const DEPARTMENTS_ADMIN = [
  { id: 'd1', name: 'Computer Science & Engineering', code: 'CSE', hods: 1, faculty: 12, courses: 18, status: 'Active' },
  { id: 'd2', name: 'Electronics & Communication', code: 'ECE', hods: 1, faculty: 10, courses: 15, status: 'Active' },
  { id: 'd3', name: 'Mechanical Engineering', code: 'ME', hods: 1, faculty: 9, courses: 14, status: 'Active' },
  { id: 'd4', name: 'Civil Engineering', code: 'CE', hods: 1, faculty: 8, courses: 12, status: 'Active' },
  { id: 'd5', name: 'Information Technology', code: 'IT', hods: 1, faculty: 11, courses: 16, status: 'Active' },
]

export const USERS_SUMMARY: { role: UserRole; count: number; active: number; pending: number }[] = [
  { role: 'Admin', count: 3, active: 3, pending: 0 },
  { role: 'Dean', count: 2, active: 2, pending: 0 },
  { role: 'HOD', count: 5, active: 5, pending: 0 },
  { role: 'Faculty', count: 47, active: 42, pending: 5 },
]

export const AUDIT_LOGS = [
  { id: 'al1', user: 'Prof. Arjun Mehta', role: 'HOD', action: 'Approved evaluation batch', resource: 'CSE-2025-BATCH-3', time: '10:41 AM', type: 'success' },
  { id: 'al2', user: 'admin@university.edu', role: 'Admin', action: 'Created user account', resource: 'Dr. Pooja Sharma (Faculty)', time: '09:55 AM', type: 'info' },
  { id: 'al3', user: 'Dr. Anita Verma', role: 'Dean', action: 'Published results', resource: 'CE Dept — Sem 5', time: '09:20 AM', type: 'success' },
  { id: 'al4', user: 'Dr. Vikash Pandey', role: 'HOD', action: 'Returned evaluation to Faculty', resource: 'IT-2025-BATCH-1', time: '08:50 AM', type: 'warning' },
  { id: 'al5', user: 'system', role: 'Admin', action: 'OCR Engine restarted', resource: 'Auto-recovery (health check)', time: '07:30 AM', type: 'error' },
  { id: 'al6', user: 'Prof. Kavitha Nair', role: 'Faculty', action: 'Submitted 34 evaluations to HOD', resource: 'ME-2025-COURSE-8', time: 'Yesterday', type: 'success' },
]

export const ADMIN_NOTIFICATIONS = [
  { id: 'n1', title: '5 Faculty Pending Activation', body: 'New faculty accounts need activation before they can access the system.', time: '1h ago', type: 'warning' as const },
  { id: 'n2', title: 'Storage at 61% Capacity', body: 'OCR asset storage is filling up. Consider archiving completed semesters.', time: '3h ago', type: 'warning' as const },
  { id: 'n3', title: 'AI Evaluation Model Updated', body: 'New AI model v2.3.1 deployed successfully. Performance improved by 8%.', time: '5h ago', type: 'success' as const },
  { id: 'n4', title: 'IT Dept Evaluation Not Started', body: 'Information Technology has not begun evaluation with 8 days to deadline.', time: '1d ago', type: 'error' as const },
]

export const ADMIN_ACTIVITY = [
  { time: '10:41', title: 'User role updated', sub: 'Dr. Pooja → Faculty', type: 'success' as const },
  { time: '09:55', title: 'New user created', sub: 'Dr. Pooja Sharma (Faculty/CSE)', type: 'info' as const },
  { time: '08:00', title: 'System config updated', sub: 'OCR confidence threshold: 0.85', type: 'neutral' as const },
  { time: 'Yesterday', title: 'Bulk import completed', sub: '12 student records for IT', type: 'success' as const },
  { time: '2d ago', title: 'Suspended user account', sub: 'temp.access@univ.edu', type: 'error' as const },
]

export const ROLE_DIST = [
  { label: 'Faculty', value: 47, color: '#3B5DE8' },
  { label: 'HOD', value: 5, color: '#1B3A6B' },
  { label: 'Dean', value: 2, color: '#7C3AED' },
  { label: 'Admin', value: 3, color: '#059669' },
]

export const DEPT_LOAD = [
  { label: 'CSE', value: 12, color: '#1B3A6B' },
  { label: 'ECE', value: 10, color: '#3B5DE8' },
  { label: 'ME', value: 9, color: '#0284C7' },
  { label: 'IT', value: 11, color: '#7C3AED' },
  { label: 'CE', value: 8, color: '#059669' },
]
