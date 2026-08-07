export type UserRole = 'Faculty' | 'HOD' | 'Dean' | 'Admin';

export type AccountStatus = 'Active' | 'Pending Activation' | 'Inactive' | 'Suspended' | 'Locked';

export type Screen =
  | 'login'
  | 'forgot-password'
  | 'reset-password'
  | 'account-activation'
  | 'profile'
  | 'edit-profile'
  | 'change-password'
  | 'dashboard-faculty'
  | 'dashboard-hod'
  | 'dashboard-dean'
  | 'dashboard-admin'
  | 'admin-users'
  | 'admin-create-user'
  | 'session-expired'
  | 'unauthorized'
  | 'ocr-workflow';

export interface User {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  role: UserRole;
  status: AccountStatus;
  lastLogin: string;
  phone: string;
}

export interface AdminUserRecord extends User {
  id: string;
  createdDate: string;
}

export interface NavContext {
  currentUser: User | null;
  navigate: (screen: Screen) => void;
  logout: () => void;
}

// ─── OCR Workflow Types ────────────────────────────────────────────────────────
export type OCRConfidence = 'High' | 'Medium' | 'Low';
export type MappingStatus = 'Mapped' | 'Needs Review' | 'Not Found';

export interface OCRField {
  label: string;
  value: string;
  confidence: OCRConfidence;
  editable?: boolean;
}

export interface AnswerSheetOCR {
  id: string;
  filename: string;
  program: string;
  branch: string;
  studentName: string;
  fatherName: string;
  rollNumber: string;
  cuid: string;
  courseName: string;
  courseCode: string;
  overallConfidence: OCRConfidence;
  fieldConfidences: Record<string, OCRConfidence>;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  mappingStatus: MappingStatus;
  mappedStudentId?: string;
}

export interface QuestionMark {
  questionNo: number;
  maxMarks: number;
  aiMarks: number;
  facultyMarks: number | null;
  confidence: OCRConfidence;
  aiComment: string;
}

export interface Examination {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  date: string;
  totalStudents: number;
  status: 'Active' | 'Closed' | 'Processing';
}
