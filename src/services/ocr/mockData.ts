import type { Examination, AnswerSheetOCR, QuestionMark } from '@/types'

export const MOCK_EXAMINATIONS: Examination[] = [
  { id: 'e1', code: 'CS401', name: 'Advanced Algorithms', department: 'Computer Science', semester: 'VII', date: '2026-01-18', totalStudents: 62, status: 'Active' },
  { id: 'e2', code: 'CS302', name: 'Database Management Systems', department: 'Computer Science', semester: 'V', date: '2026-01-16', totalStudents: 74, status: 'Active' },
  { id: 'e3', code: 'CS501', name: 'Machine Learning', department: 'Computer Science', semester: 'VIII', date: '2026-01-14', totalStudents: 48, status: 'Closed' },
]

export const MOCK_SHEETS: AnswerSheetOCR[] = [
  {
    id: 's1', filename: 'answersheet_2021UCS042.pdf',
    program: 'B.Tech', branch: 'Computer Science & Engineering',
    studentName: 'Aryan Kapoor', fatherName: 'Suresh Kapoor',
    rollNumber: '2021UCS042', cuid: 'CU21001234',
    courseName: 'Advanced Algorithms', courseCode: 'CS401',
    overallConfidence: 'High',
    fieldConfidences: { program: 'High', branch: 'High', studentName: 'High', fatherName: 'High', rollNumber: 'High', cuid: 'Medium', courseName: 'High', courseCode: 'High' },
    verificationStatus: 'pending', mappingStatus: 'Mapped', mappedStudentId: 'STU-2021-042',
  },
  {
    id: 's2', filename: 'answersheet_2021UCS055.pdf',
    program: 'B.Tech', branch: 'Computer Science & Engineering',
    studentName: 'Sneha Agarwal', fatherName: 'Rakesh Agarwal',
    rollNumber: '2021UCS055', cuid: 'CU21001247',
    courseName: 'Advance Algorithms', courseCode: 'CS401',
    overallConfidence: 'Medium',
    fieldConfidences: { program: 'High', branch: 'Medium', studentName: 'High', fatherName: 'Medium', rollNumber: 'High', cuid: 'Low', courseName: 'Low', courseCode: 'High' },
    verificationStatus: 'pending', mappingStatus: 'Needs Review',
  },
  {
    id: 's3', filename: 'answersheet_2021UCS067.pdf',
    program: 'B.Tech', branch: 'CSE',
    studentName: 'Rohan Mishra', fatherName: 'Dinesh Mishra',
    rollNumber: '2021UCS067', cuid: 'CU21001259',
    courseName: 'Advanced Algorithms', courseCode: 'CS401',
    overallConfidence: 'High',
    fieldConfidences: { program: 'High', branch: 'Low', studentName: 'High', fatherName: 'High', rollNumber: 'High', cuid: 'High', courseName: 'High', courseCode: 'High' },
    verificationStatus: 'pending', mappingStatus: 'Mapped', mappedStudentId: 'STU-2021-067',
  },
  {
    id: 's4', filename: 'answersheet_unknown.pdf',
    program: 'B.Tech', branch: 'Computer Science',
    studentName: 'Kavya Reddy', fatherName: 'Subrahmanyam Reddy',
    rollNumber: '2021UCS089', cuid: '',
    courseName: 'Advanced Algorithms', courseCode: 'CS401',
    overallConfidence: 'Low',
    fieldConfidences: { program: 'Medium', branch: 'Low', studentName: 'Medium', fatherName: 'Low', rollNumber: 'Low', cuid: 'Low', courseName: 'Medium', courseCode: 'Medium' },
    verificationStatus: 'pending', mappingStatus: 'Not Found',
  },
]

export const MOCK_QUESTIONS: QuestionMark[] = [
  { questionNo: 1, maxMarks: 10, aiMarks: 9, facultyMarks: null, confidence: 'High', aiComment: 'Correct explanation of time complexity with proper Big-O notation. Minor omission in worst-case analysis.' },
  { questionNo: 2, maxMarks: 10, aiMarks: 7, facultyMarks: null, confidence: 'High', aiComment: 'Dynamic programming approach is correct. Memoization table constructed properly. Optimal substructure proof incomplete.' },
  { questionNo: 3, maxMarks: 10, aiMarks: 4, facultyMarks: null, confidence: 'Medium', aiComment: 'Partial credit: graph traversal logic partially correct. BFS implementation has a flaw in visited node tracking.' },
  { questionNo: 4, maxMarks: 10, aiMarks: 8, facultyMarks: null, confidence: 'High', aiComment: 'Greedy algorithm correctly implemented. Proof of optimality is well-structured.' },
  { questionNo: 5, maxMarks: 10, aiMarks: 6, facultyMarks: null, confidence: 'Medium', aiComment: 'Network flow analysis partially done. Max-flow min-cut theorem stated but not applied correctly.' },
  { questionNo: 6, maxMarks: 5, aiMarks: 5, facultyMarks: null, confidence: 'High', aiComment: 'Complete and accurate answer to the definition-based question.' },
  { questionNo: 7, maxMarks: 5, aiMarks: 3, facultyMarks: null, confidence: 'Low', aiComment: 'Handwriting unclear in section 7. Marks assigned conservatively. Faculty review recommended.' },
  { questionNo: 8, maxMarks: 5, aiMarks: 4, facultyMarks: null, confidence: 'High', aiComment: 'String matching algorithm with KMP correctly traced. One index error in failure function.' },
  { questionNo: 9, maxMarks: 5, aiMarks: 2, facultyMarks: null, confidence: 'Medium', aiComment: 'Complexity analysis missing. Only the algorithm steps are shown without justification.' },
  { questionNo: 10, maxMarks: 10, aiMarks: 8, facultyMarks: null, confidence: 'High', aiComment: 'Divide and conquer explanation is thorough. Recurrence relation solved correctly using Master Theorem.' },
]

export const MOCK_STUDENT_DB = [
  { id: 'STU-2021-042', name: 'Aryan Kapoor', rollNumber: '2021UCS042', cuid: 'CU21001234', program: 'B.Tech CSE' },
  { id: 'STU-2021-055', name: 'Sneha Agarwal', rollNumber: '2021UCS055', cuid: 'CU21001247', program: 'B.Tech CSE' },
  { id: 'STU-2021-067', name: 'Rohan Mishra', rollNumber: '2021UCS067', cuid: 'CU21001259', program: 'B.Tech CSE' },
  { id: 'STU-2021-071', name: 'Kavya Reddi', rollNumber: '2021UCS071', cuid: 'CU21001263', program: 'B.Tech CSE' },
  { id: 'STU-2021-089', name: 'Kiran Reddy', rollNumber: '2021UCS089', cuid: 'CU21001281', program: 'B.Tech CSE' },
]

