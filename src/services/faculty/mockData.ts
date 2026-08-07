// Mock data for the Faculty dashboard (placeholder until a real API is wired in)

export const ASSIGNED_EXAMS = [
  { id: 'e1', code: 'CS401', name: 'Advanced Algorithms', semester: 'VII', date: '2026-01-18', total: 62, uploaded: 62, ocrDone: 62, evaluated: 45, verified: 28, status: 'In Progress' },
  { id: 'e2', code: 'CS302', name: 'Database Management Systems', semester: 'V', date: '2026-01-16', total: 74, uploaded: 74, ocrDone: 74, evaluated: 74, verified: 74, status: 'Submitted to HOD' },
  { id: 'e3', code: 'CS501', name: 'Machine Learning', semester: 'VIII', date: '2026-01-14', total: 48, uploaded: 0, ocrDone: 0, evaluated: 0, verified: 0, status: 'Pending Upload' },
  { id: 'e4', code: 'CS205', name: 'Data Structures', semester: 'III', date: '2026-01-20', total: 81, uploaded: 0, ocrDone: 0, evaluated: 0, verified: 0, status: 'Scheduled' },
]

export const NOTIFICATIONS = [
  { id: 'n1', title: 'HOD Returned Evaluation', body: 'CS302 evaluation returned for re-verification of Q7 marks.', time: '2h ago', type: 'warning' as const },
  { id: 'n2', title: 'OCR Processing Complete', body: 'CS401: 62 sheets processed. Review OCR results.', time: '5h ago', type: 'success' as const },
  { id: 'n3', title: 'Deadline Reminder', body: 'CS501 upload deadline in 3 days (Jan 21, 2026).', time: '1d ago', type: 'info' as const },
  { id: 'n4', title: 'Low Confidence Alert', body: '7 answer sheets flagged with low OCR confidence in CS401.', time: '1d ago', type: 'error' as const },
]

export const ACTIVITY = [
  { time: '09:41', title: 'Submitted CS302 to HOD', sub: '74 sheets · 68.2/100 avg marks', type: 'success' as const },
  { time: '08:15', title: 'Verified 17 sheets in CS401', sub: 'Q7 marks manually corrected for 3 sheets', type: 'info' as const },
  { time: 'Yesterday', title: 'OCR Completed — CS401', sub: '62 sheets processed · 89% high confidence', type: 'success' as const },
  { time: 'Yesterday', title: 'Uploaded 62 sheets for CS401', sub: 'Processing started automatically', type: 'info' as const },
  { time: '2d ago', title: 'AI Evaluation flagged Q7', sub: 'Low confidence in 7 cases — review required', type: 'warning' as const },
  { time: '3d ago', title: 'CS302 evaluation completed', sub: 'All 74 sheets verified and ready for HOD', type: 'neutral' as const },
]

export const EVAL_TREND = [28, 35, 42, 38, 51, 59, 63, 70, 68, 74]

export const CAL_EVENTS = [
  { day: 16, label: 'CS302 Submitted', color: '#059669' },
  { day: 18, label: 'CS401 Deadline', color: '#D97706' },
  { day: 20, label: 'CS205 Exam', color: '#3B5DE8' },
  { day: 21, label: 'CS501 Upload Deadline', color: '#DC2626' },
  { day: 25, label: 'HOD Review Meeting', color: '#7C3AED' },
]

export const SUBJECT_PROGRESS = [
  { label: 'CS401 · Advanced Algorithms', value: 73, color: '#1B3A6B' },
  { label: 'CS302 · Database Mgmt', value: 100, color: '#059669' },
  { label: 'CS501 · Machine Learning', value: 0, color: '#D97706' },
  { label: 'CS205 · Data Structures', value: 0, color: '#94A3B8' },
]

export const CONFIDENCE_DIST = [
  { label: 'High Confidence', value: 142, color: '#059669' },
  { label: 'Medium Confidence', value: 38, color: '#D97706' },
  { label: 'Low Confidence', value: 7, color: '#DC2626' },
]
