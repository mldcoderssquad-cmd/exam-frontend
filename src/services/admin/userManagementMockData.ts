import type { AdminUserRecord } from '@/types'

export const MOCK_ADMIN_USERS: AdminUserRecord[] = [
  { id: '1', name: 'Dr. Priya Sharma', email: 'priya.sharma@university.edu', employeeId: 'EMP-2021-042', department: 'Computer Science', designation: 'Associate Professor', role: 'HOD', status: 'Active', lastLogin: '2025-01-15 09:41', phone: '+91 98765 43210', createdDate: '2021-06-15' },
  { id: '2', name: 'Prof. Arjun Mehta', email: 'arjun.mehta@university.edu', employeeId: 'EMP-2019-017', department: 'Mathematics', designation: 'Professor', role: 'Faculty', status: 'Active', lastLogin: '2025-01-14 16:20', phone: '+91 87654 32109', createdDate: '2019-08-01' },
  { id: '3', name: 'Dr. Sunita Rao', email: 'sunita.rao@university.edu', employeeId: 'EMP-2023-089', department: 'Physics', designation: 'Assistant Professor', role: 'Faculty', status: 'Pending Activation', lastLogin: '—', phone: '+91 76543 21098', createdDate: '2023-11-20' },
  { id: '4', name: 'Prof. Vikram Nair', email: 'vikram.nair@university.edu', employeeId: 'EMP-2018-003', department: 'All Departments', designation: 'Dean of Academics', role: 'Dean', status: 'Active', lastLogin: '2025-01-15 11:05', phone: '+91 65432 10987', createdDate: '2018-01-10' },
  { id: '5', name: 'Dr. Ananya Singh', email: 'ananya.singh@university.edu', employeeId: 'EMP-2022-061', department: 'Chemistry', designation: 'Assistant Professor', role: 'Faculty', status: 'Suspended', lastLogin: '2024-12-01 14:30', phone: '+91 54321 09876', createdDate: '2022-03-15' },
  { id: '6', name: 'Mr. Rahul Gupta', email: 'rahul.gupta@university.edu', employeeId: 'EMP-2020-033', department: 'IT Services', designation: 'System Administrator', role: 'Admin', status: 'Active', lastLogin: '2025-01-15 08:00', phone: '+91 43210 98765', createdDate: '2020-05-01' },
]
