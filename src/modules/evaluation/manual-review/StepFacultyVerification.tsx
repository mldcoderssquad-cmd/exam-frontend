import { useState } from 'react'
import { Card, CardHeader, Button, Alert, CheckCircleIcon, CheckIcon, Table, Th, Td, Toast } from '@/components/common'
import type { QuestionMark, AnswerSheetOCR, Screen } from '@/types'
import { MappingBadge } from '@/modules/ocr/shared'

export type VerificationDecision = 'approved' | 'modified' | 'rejected' | null

export default function StepFacultyVerification({ sheets, questions, onSubmitToHOD, onNavigate }: {
  sheets: AnswerSheetOCR[]
  questions: QuestionMark[]
  onSubmitToHOD: () => void
  onNavigate: (s: Screen) => void
}) {
  const [decision, setDecision] = useState<VerificationDecision>(null)
  const [remarks, setRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const totalMax = questions.reduce((sum, q) => sum + q.maxMarks, 0)
  const totalMarks = questions.reduce((sum, q) => sum + (q.facultyMarks ?? q.aiMarks), 0)
  const overrideCount = questions.filter(q => q.facultyMarks !== null).length
  const lowConfQ = questions.filter(q => q.confidence === 'Low').length
  const approvedSheets = sheets.filter(s => s.verificationStatus === 'approved').length

  const handleSubmit = () => {
    if (!decision || !remarks.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitted(true)
      setToastVisible(true)
      setTimeout(() => { setToastVisible(false); setTimeout(onSubmitToHOD, 800) }, 2500)
    }, 1600)
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center">
              <CheckCircleIcon size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Submitted to HOD</h2>
              <p className="text-sm text-[#475569] mt-2 max-w-sm mx-auto leading-relaxed">
                Your evaluation has been successfully submitted to the Head of Department for review and approval.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="px-4 py-2 rounded-lg bg-[#EEF4FF] text-[#1B3A6B] text-sm font-semibold">
                {sheets.length} sheets evaluated
              </div>
              <div className="px-4 py-2 rounded-lg bg-[#D1FAE5] text-[#065F46] text-sm font-semibold">
                {totalMarks}/{totalMax} marks
              </div>
            </div>
            <Button variant="primary" size="md" onClick={() => onNavigate('dashboard-faculty')}>
              Return to Dashboard
            </Button>
          </div>
        </Card>
        <Toast message="Evaluation submitted to HOD successfully!" type="success" visible={toastVisible} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sheets Evaluated', value: sheets.length, color: '#1B3A6B' },
          { label: 'Verified Sheets', value: approvedSheets, color: '#059669' },
          { label: 'Final Marks', value: `${totalMarks}/${totalMax}`, color: '#3B5DE8' },
          { label: 'Low Conf. Questions', value: lowConfQ, color: lowConfQ > 0 ? '#D97706' : '#059669' },
        ].map(s => (
          <Card key={s.label} className="text-center py-4">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#94A3B8] mt-1 font-medium">{s.label}</div>
          </Card>
        ))}
      </div>

      {lowConfQ > 0 && (
        <Alert variant="warning" title="Low-Confidence Questions Detected"
          message={`${lowConfQ} question${lowConfQ > 1 ? 's' : ''} were flagged with low OCR/AI confidence. Please ensure these have been manually reviewed before submitting.`} />
      )}

      {/* Evaluation summary table */}
      <Card>
        <CardHeader title="Evaluation Summary" subtitle="Final marks per sheet before HOD submission" />
        <Table>
          <thead>
            <tr>
              <Th>Student</Th>
              <Th>Roll Number</Th>
              <Th>Verification</Th>
              <Th>Mapping</Th>
              <Th className="text-right">Total Marks</Th>
            </tr>
          </thead>
          <tbody>
            {sheets.map(sheet => (
              <tr key={sheet.id} className="hover:bg-[#F8FAFC]">
                <Td>
                  <div className="font-semibold text-[#0F172A]">{sheet.studentName}</div>
                  <div className="text-xs text-[#94A3B8]">{sheet.cuid || '—'}</div>
                </Td>
                <Td><span className="font-mono text-xs">{sheet.rollNumber}</span></Td>
                <Td>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    sheet.verificationStatus === 'approved' ? 'bg-[#D1FAE5] text-[#065F46]' :
                    sheet.verificationStatus === 'rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                    'bg-[#FEF3C7] text-[#92400E]'
                  }`}>{sheet.verificationStatus}</span>
                </Td>
                <Td><MappingBadge status={sheet.mappingStatus} /></Td>
                <Td className="text-right font-bold text-[#0F172A]">{totalMarks}/{totalMax}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-3 p-3 rounded-lg bg-[#0F2142] text-white flex justify-between items-center">
          <span className="text-sm font-semibold">Overall: {Math.round(totalMarks / totalMax * 100)}% · {overrideCount} faculty overrides</span>
          <span className="text-xl font-bold">{totalMarks}/{totalMax}</span>
        </div>
      </Card>

      {/* Decision */}
      <Card>
        <CardHeader title="Faculty Verification Decision" subtitle="Select your decision and provide remarks before submitting to HOD" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { val: 'approved', label: 'Approve', desc: 'Evaluation is correct and complete', color: 'border-[#A7F3D0] bg-[#D1FAE5] text-[#065F46]', active: 'border-[#059669] bg-[#D1FAE5] ring-2 ring-[#059669]/30' },
              { val: 'modified', label: 'Approve with Modifications', desc: 'Approved but with noted corrections', color: 'border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]', active: 'border-[#D97706] bg-[#FEF3C7] ring-2 ring-[#D97706]/30' },
              { val: 'rejected', label: 'Reject', desc: 'Requires re-evaluation', color: 'border-[#FECACA] bg-[#FEE2E2] text-[#991B1B]', active: 'border-[#DC2626] bg-[#FEE2E2] ring-2 ring-[#DC2626]/30' },
            ] as { val: VerificationDecision; label: string; desc: string; color: string; active: string }[]).map(opt => (
              <button
                key={opt.val}
                onClick={() => setDecision(opt.val)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${decision === opt.val ? opt.active : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'}`}
              >
                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full mb-2 ${decision === opt.val ? opt.color : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                  {decision === opt.val ? <CheckIcon size={14} /> : <span className="text-xs">○</span>}
                </div>
                <div className="text-sm font-bold text-[#0F172A]">{opt.label}</div>
                <div className="text-xs text-[#475569] mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#0F172A]">Faculty Remarks <span className="text-[#DC2626]">*</span></label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Add your verification remarks, observations, or corrections…"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] resize-none outline-none focus:border-[#3B5DE8] focus:ring-2 focus:ring-[#3B5DE8]/20 placeholder:text-[#94A3B8]"
            />
            <p className="text-xs text-[#94A3B8]">Remarks will be included in the HOD review report.</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            disabled={!decision || !remarks.trim()}
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting to HOD…' : 'Submit to HOD for Approval →'}
          </Button>

          {(!decision || !remarks.trim()) && (
            <p className="text-xs text-center text-[#94A3B8]">
              Select a decision and add remarks to enable submission.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
