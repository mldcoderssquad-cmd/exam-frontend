export type OCRStep = 'upload' | 'processing' | 'results' | 'verification' | 'mapping' | 'ai-evaluation' | 'faculty-verification'

export const STEPS: { id: OCRStep; label: string; short: string }[] = [
  { id: 'upload', label: 'Upload Answer Sheets', short: 'Upload' },
  { id: 'processing', label: 'OCR Processing', short: 'OCR' },
  { id: 'results', label: 'OCR Results', short: 'Results' },
  { id: 'verification', label: 'Student Verification', short: 'Verify' },
  { id: 'mapping', label: 'Student Mapping', short: 'Mapping' },
  { id: 'ai-evaluation', label: 'AI Evaluation', short: 'AI Eval' },
  { id: 'faculty-verification', label: 'Faculty Verification', short: 'Submit' },
]
