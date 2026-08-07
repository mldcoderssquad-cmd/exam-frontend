// Mock data for the Dean dashboard (placeholder until a real API is wired in)

export const DEPARTMENTS = [
  {
    id: 'd1', name: 'Computer Science & Engineering', code: 'CSE',
    hod: 'Prof. Arjun Mehta', faculty: 12, courses: 18, subjects: 54,
    totalSheets: 641, completed: 531, approved: 380, rejected: 28, pending: 110,
    avgMarks: 68.4, avgTime: '4.1h', passPercent: 82,
    status: 'In Progress',
    grades: { O: 45, A: 118, B: 163, C: 97, P: 62, F: 46 },
  },
  {
    id: 'd2', name: 'Electronics & Communication', code: 'ECE',
    hod: 'Dr. Sunita Rao', faculty: 10, courses: 15, subjects: 44,
    totalSheets: 524, completed: 524, approved: 524, rejected: 0, pending: 0,
    avgMarks: 71.2, avgTime: '3.9h', passPercent: 88,
    status: 'Ready to Publish',
    grades: { O: 62, A: 141, B: 152, C: 89, P: 48, F: 32 },
  },
  {
    id: 'd3', name: 'Mechanical Engineering', code: 'ME',
    hod: 'Prof. Sanjay Gupta', faculty: 9, courses: 14, subjects: 40,
    totalSheets: 478, completed: 312, approved: 280, rejected: 15, pending: 166,
    avgMarks: 64.7, avgTime: '4.6h', passPercent: 76,
    status: 'Partial',
    grades: { O: 28, A: 92, B: 128, C: 74, P: 42, F: 48 },
  },
  {
    id: 'd4', name: 'Civil Engineering', code: 'CE',
    hod: 'Dr. Anita Verma', faculty: 8, courses: 12, subjects: 36,
    totalSheets: 389, completed: 389, approved: 389, rejected: 0, pending: 0,
    avgMarks: 69.8, avgTime: '3.7h', passPercent: 85,
    status: 'Dean Approval Pending',
    grades: { O: 38, A: 104, B: 127, C: 82, P: 26, F: 12 },
  },
  {
    id: 'd5', name: 'Information Technology', code: 'IT',
    hod: 'Dr. Vikash Pandey', faculty: 11, courses: 16, subjects: 48,
    totalSheets: 561, completed: 182, approved: 0, rejected: 0, pending: 379,
    avgMarks: 0, avgTime: '—', passPercent: 0,
    status: 'Not Started',
    grades: { O: 0, A: 0, B: 0, C: 0, P: 0, F: 0 },
  },
]

export const DEAN_NOTIFICATIONS = [
  { id: 'n1', title: 'ECE Ready for Dean Approval', body: '524 sheets from ECE dept fully evaluated and HOD-approved.', time: '30m ago', type: 'success' as const },
  { id: 'n2', title: 'CE Awaiting Dean Sign-off', body: 'Civil Engineering evaluation complete — awaiting your approval to publish.', time: '2h ago', type: 'info' as const },
  { id: 'n3', title: 'ME Department Behind Schedule', body: 'Mechanical Engineering is 35% behind. 3 faculty not yet started.', time: '5h ago', type: 'warning' as const },
  { id: 'n4', title: 'IT Dept Deadline Risk', body: 'Information Technology evaluation has not begun with 8 days to semester deadline.', time: '1d ago', type: 'error' as const },
]

export const DEAN_ACTIVITY = [
  { time: '09:15', title: 'Approved ECE Phase 1 results', sub: '261 sheets published', type: 'success' as const },
  { time: '08:00', title: 'Reviewed CE evaluation report', sub: 'Pending final approval', type: 'info' as const },
  { time: 'Yesterday', title: 'Returned ME batch to HOD', sub: '15 sheets — grade anomalies detected', type: 'warning' as const },
  { time: '2d ago', title: 'CSE progress review', sub: 'Requested HOD status update', type: 'neutral' as const },
  { time: '3d ago', title: 'System-wide audit initiated', sub: 'IT dept flagged for delay', type: 'error' as const },
]

export const DEPT_COMPARISON = [
  { group: 'CSE', values: [531, 380] },
  { group: 'ECE', values: [524, 524] },
  { group: 'ME', values: [312, 280] },
  { group: 'CE', values: [389, 389] },
  { group: 'IT', values: [182, 0] },
]

export const COLLEGE_STATUS = [
  { label: 'Approved & Published', value: 380 + 524 + 280 + 389, color: '#059669' },
  { label: 'Evaluated, Pending Approval', value: 531 - 380 + 389 - 389 + 312 - 280 + 182, color: '#3B5DE8' },
  { label: 'In Evaluation', value: 110 + 166 + 379, color: '#D97706' },
  { label: 'Not Started', value: 0, color: '#94A3B8' },
]

export const GRADE_DIST = [
  { label: 'Outstanding (O)', value: 45 + 62 + 28 + 38, color: '#059669' },
  { label: 'Excellent (A)', value: 118 + 141 + 92 + 104, color: '#3B5DE8' },
  { label: 'Good (B)', value: 163 + 152 + 128 + 127, color: '#0284C7' },
  { label: 'Average (C)', value: 97 + 89 + 74 + 82, color: '#D97706' },
  { label: 'Pass (P)', value: 62 + 48 + 42 + 26, color: '#F59E0B' },
  { label: 'Fail (F)', value: 46 + 32 + 48 + 12, color: '#DC2626' },
]
