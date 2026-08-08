// src/modules/ocr/extraction/StepResults.tsx

import { Card, CardHeader, Button, ChevronRightIcon, Alert } from '@/components/common'
import { ConfidenceBadge } from '../shared'
import type { AnswerSheetOCR, OCRConfidence } from '@/types'
import { useOCRStore } from '@/stores/ocrStore'
import { transformStudentToSheet } from '@/services/api/transformers'

export default function StepResults({ onNext, onVerifySheet }: {
  onNext: () => void
  onVerifySheet: (id: string) => void
}) {
  // Get results from store
  const { results, summary } = useOCRStore()
  
  // Transform results to sheets
  const sheets = results && results.length > 0 
    ? results.map(transformStudentToSheet)
    : []

  // If no results, show empty state
  if (!sheets || sheets.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-[#94A3B8]">No results available. Please process some sheets first.</p>
      </Card>
    )
  }

  const fields: (keyof AnswerSheetOCR)[] = ['studentName', 'rollNumber', 'cuid', 'courseName']
  const lowCount = sheets.filter(s => s.overallConfidence === 'Low').length
  const medCount = sheets.filter(s => s.overallConfidence === 'Medium').length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sheets', value: sheets.length, color: '#1B3A6B', bg: '#EEF4FF' },
          { label: 'High Confidence', value: sheets.filter(s => s.overallConfidence === 'High').length, color: '#059669', bg: '#D1FAE5' },
          { label: 'Needs Review', value: medCount, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Low Confidence', value: lowCount, color: '#DC2626', bg: '#FEE2E2' },
        ].map(stat => (
          <Card key={stat.label} className="text-center py-4">
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-[#94A3B8] mt-1 font-medium">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Show summary from API */}
      {summary && (
        <Alert 
          variant="info" 
          title="Processing Summary"
          message={`${summary.successful} of ${summary.total_students} students processed successfully. Average score: ${summary.average_percentage}%`} 
        />
      )}

      {(lowCount > 0 || medCount > 0) && (
        <Alert variant="warning" title="Review Required"
          message={`${lowCount + medCount} sheet${lowCount + medCount > 1 ? 's' : ''} have medium or low OCR confidence. Please verify and correct the extracted data before proceeding.`} />
      )}

      {/* Per-sheet results */}
      <Card padding={false}>
        <div className="p-5 border-b border-[#E2E8F0]">
          <h3 className="text-base font-semibold text-[#0F172A]">Extracted Student Information</h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">Uncertain fields are highlighted. Click Verify to review and correct individual sheets.</p>
        </div>
        <div className="divide-y divide-[#F1F5F9]">
          {sheets.map((sheet, idx) => (
            <div key={sheet.id} className="p-5 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF4FF] flex items-center justify-center text-[#1B3A6B] text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#0F172A]">{sheet.studentName}</span>
                      <ConfidenceBadge confidence={sheet.overallConfidence} />
                      {sheet.verificationStatus === 'approved' && (
                        <span className="text-xs font-semibold text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded-full">Verified</span>
                      )}
                    </div>
                    <div className="text-xs text-[#94A3B8] mt-0.5">{sheet.filename}</div>
                  </div>
                </div>
                <button
                  onClick={() => onVerifySheet(sheet.id)}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1B3A6B] bg-[#EEF4FF] hover:bg-[#BACFFB] border border-[#BACFFB] transition-colors"
                >
                  {sheet.verificationStatus === 'approved' ? 'Re-verify' : 'Verify →'}
                </button>
              </div>

              {/* Fields grid */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Program', val: sheet.program, field: 'program' },
                  { label: 'Branch', val: sheet.branch, field: 'branch' },
                  { label: 'Roll Number', val: sheet.rollNumber, field: 'rollNumber' },
                  { label: 'CUID', val: sheet.cuid || '—', field: 'cuid' },
                  { label: 'Course Name', val: sheet.courseName, field: 'courseName' },
                  { label: 'Course Code', val: sheet.courseCode, field: 'courseCode' },
                  { label: 'Father Name', val: sheet.fatherName, field: 'fatherName' },
                ].map(f => {
                  const conf = sheet.fieldConfidences?.[f.field] as OCRConfidence || 'High'
                  return (
                    <div key={f.label} className={`rounded-lg px-2.5 py-2 border text-xs ${
                      conf === 'Low' ? 'bg-[#FEF2F2] border-[#FECACA]' :
                      conf === 'Medium' ? 'bg-[#FFFBEB] border-[#FDE68A]' :
                      'bg-[#F8FAFC] border-[#E2E8F0]'
                    }`}>
                      <div className="text-[#94A3B8] mb-0.5">{f.label}</div>
                      <div className={`font-semibold truncate ${
                        conf === 'Low' ? 'text-[#DC2626]' :
                        conf === 'Medium' ? 'text-[#D97706]' :
                        'text-[#0F172A]'
                      }`}>{f.val}</div>
                      <ConfidenceBadge confidence={conf} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={onNext} leftIcon={<ChevronRightIcon size={16} />}>
          Proceed to Verification
        </Button>
      </div>
    </div>
  )
}