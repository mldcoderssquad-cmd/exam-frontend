// Mock data for the HOD dashboard (placeholder until a real API is wired in)

export const FACULTY_LIST = [
  {
    id: 'f1', name: 'Dr. Priya Sharma', designation: 'Associate Professor',
    subjects: ['CS401 — Advanced Algorithms', 'CS501 — Machine Learning'],
    assigned: 110, completed: 73, pending: 37,
    status: 'Evaluating', avgTime: '4.2h', lowConfPct: 6.3,
    workload: 'High', submittedToHOD: 74, approved: 74, returned: 4,
    trend: [15, 23, 31, 40, 52, 60, 73],
  },
  {
    id: 'f2', name: 'Prof. Rajan Kumar', designation: 'Assistant Professor',
    subjects: ['CS302 — Database Management', 'CS205 — Data Structures'],
    assigned: 155, completed: 155, pending: 0,
    status: 'All Submitted', avgTime: '3.8h', lowConfPct: 4.1,
    workload: 'Normal', submittedToHOD: 155, approved: 140, returned: 15,
    trend: [30, 55, 80, 105, 130, 148, 155],
  },
  {
    id: 'f3', name: 'Dr. Meena Iyer', designation: 'Associate Professor',
    subjects: ['CS403 — Computer Networks', 'CS502 — Cloud Computing'],
    assigned: 89, completed: 42, pending: 47,
    status: 'Pending OCR', avgTime: '5.1h', lowConfPct: 9.7,
    workload: 'High', submittedToHOD: 42, approved: 0, returned: 0,
    trend: [0, 8, 16, 24, 35, 38, 42],
  },
  {
    id: 'f4', name: 'Mr. Anil Desai', designation: 'Assistant Professor',
    subjects: ['CS101 — Programming Fundamentals'],
    assigned: 93, completed: 93, pending: 0,
    status: 'Approved', avgTime: '3.5h', lowConfPct: 2.8,
    workload: 'Normal', submittedToHOD: 93, approved: 93, returned: 0,
    trend: [20, 40, 60, 75, 85, 90, 93],
  },
  {
    id: 'f5', name: 'Dr. Kavita Nath', designation: 'Professor',
    subjects: ['CS601 — Distributed Systems', 'CS405 — Compiler Design'],
    assigned: 76, completed: 21, pending: 55,
    status: 'Not Started', avgTime: '—', lowConfPct: 0,
    workload: 'Low', submittedToHOD: 0, approved: 0, returned: 0,
    trend: [0, 0, 3, 8, 14, 18, 21],
  },
]

export const PENDING_APPROVALS = [
  { id: 'a1', faculty: 'Dr. Priya Sharma', exam: 'CS302 — Database Management', sheets: 74, submittedAt: '2026-01-15 09:30', avgMarks: 68.2, lowConf: 3, priority: 'Normal' },
  { id: 'a2', faculty: 'Prof. Rajan Kumar', exam: 'CS205 — Data Structures', sheets: 93, submittedAt: '2026-01-15 07:45', avgMarks: 72.4, lowConf: 0, priority: 'High' },
  { id: 'a3', faculty: 'Mr. Anil Desai', exam: 'CS101 — Programming Fundamentals', sheets: 93, submittedAt: '2026-01-14 16:20', avgMarks: 61.8, lowConf: 5, priority: 'Normal' },
]

export const DEPT_NOTIFICATIONS = [
  { id: 'n1', title: 'Faculty Submission Received', body: 'Prof. Rajan Kumar submitted CS205 evaluation (93 sheets).', time: '1h ago', type: 'success' as const },
  { id: 'n2', title: 'Overdue: Dr. Kavita Nath', body: 'CS601 evaluation not started — 3 days overdue.', time: '3h ago', type: 'error' as const },
  { id: 'n3', title: 'Low Confidence Alert', body: 'CS403 (Dr. Meena Iyer): 9.7% low-confidence sheets.', time: '6h ago', type: 'warning' as const },
  { id: 'n4', title: 'Dean Approval Request', body: 'Send CS302 to Dean after HOD approval.', time: '1d ago', type: 'info' as const },
]

export const DEPT_ACTIVITY = [
  { time: '09:30', title: 'Prof. Rajan Kumar submitted CS205', sub: '93 sheets · 72.4/100 avg', type: 'success' as const },
  { time: '07:45', title: 'HOD approved CS101 evaluation', sub: '93 sheets forwarded to Dean', type: 'success' as const },
  { time: 'Yesterday', title: 'Returned CS302 to Dr. Priya', sub: 'Q7 marks need correction in 4 cases', type: 'warning' as const },
  { time: '2d ago', title: 'Sent CS302 approval to Dean', sub: '74 sheets · first batch', type: 'info' as const },
  { time: '3d ago', title: 'Dr. Meena Iyer started CS403', sub: 'OCR processing complete', type: 'neutral' as const },
]

export const COMPARISON_DATA = [
  { group: 'Dr. Priya', values: [73, 37] },
  { group: 'Prof. Rajan', values: [155, 0] },
  { group: 'Dr. Meena', values: [42, 47] },
  { group: 'Mr. Anil', values: [93, 0] },
  { group: 'Dr. Kavita', values: [21, 55] },
]

export const APPROVAL_STATUS = [
  { label: 'Approved', value: 307, color: '#059669' },
  { label: 'Pending Review', value: 260, color: '#D97706' },
  { label: 'Returned', value: 19, color: '#DC2626' },
  { label: 'Not Started', value: 55, color: '#94A3B8' },
]
