import { useState, useEffect } from 'react'
import { Card, Button, Alert, AlertTriangleIcon, CheckIcon, XIcon } from '@/components/common'
import { ConfidenceBadge, AnswerSheetPreview } from '../shared'
import type { AnswerSheetOCR, OCRConfidence } from '@/types'

export default function StepVerification({ sheets, onSheetsUpdate, onNext, verifyingId, onVerifySheet }: {
  sheets: AnswerSheetOCR[]
  onSheetsUpdate: (sheets: AnswerSheetOCR[]) => void
  onNext: () => void
  verifyingId: string | null
  onVerifySheet: (id: string | null) => void
}) {
  const [editFields, setEditFields] = useState<Partial<AnswerSheetOCR>>({})
  const [activeSheet, setActiveSheet] = useState<AnswerSheetOCR | null>(
    verifyingId ? sheets.find(s => s.id === verifyingId) ?? sheets[0] : sheets[0]
  )
  const [highlightField, setHighlightField] = useState<string | undefined>()

  useEffect(() => {
    if (verifyingId) {
      const s = sheets.find(s => s.id === verifyingId)
      if (s) { setActiveSheet(s); setEditFields({}) }
    }
  }, [verifyingId])

  if (!activeSheet) return null

  const merged = { ...activeSheet, ...editFields }

  const fieldDefs = [
    { key: 'program', label: 'Program', placeholder: 'e.g. B.Tech' },
    { key: 'branch', label: 'Branch / Specialization', placeholder: 'e.g. Computer Science & Engineering' },
    { key: 'studentName', label: 'Student Name', placeholder: 'Full name as on records' },
    { key: 'fatherName', label: "Father's Name", placeholder: "Father's full name" },
    { key: 'rollNumber', label: 'University Roll Number', placeholder: 'e.g. 2021UCS042' },
    { key: 'cuid', label: 'CUID', placeholder: 'e.g. CU21001234' },
    { key: 'courseName', label: 'Course Name', placeholder: 'Full course name' },
    { key: 'courseCode', label: 'Course Code', placeholder: 'e.g. CS401' },
  ]

  const handleApprove = () => {
    const updated = sheets.map(s => s.id === activeSheet.id ? { ...s, ...editFields, verificationStatus: 'approved' as const } : s)
    onSheetsUpdate(updated)
    const next = sheets.find(s => s.id !== activeSheet.id && s.verificationStatus !== 'approved')
    if (next) { setActiveSheet(next); setEditFields({}) }
    else onNext()
  }

  const handleReject = () => {
    const updated = sheets.map(s => s.id === activeSheet.id ? { ...s, verificationStatus: 'rejected' as const } : s)
    onSheetsUpdate(updated)
    const next = sheets.find(s => s.id !== activeSheet.id && s.verificationStatus !== 'approved')
    if (next) { setActiveSheet(next); setEditFields({}) }
  }

  const pendingCount = sheets.filter(s => s.verificationStatus === 'pending').length

  return (
    <div className="space-y-4">
      {/* Sheet selector */}
      <Card className="py-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mr-1">Sheets:</span>
          {sheets.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveSheet(s); setEditFields({}); setHighlightField(undefined) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                s.id === activeSheet.id ? 'bg-[#1B3A6B] border-[#1B3A6B] text-white' :
                s.verificationStatus === 'approved' ? 'bg-[#D1FAE5] border-[#A7F3D0] text-[#065F46]' :
                s.verificationStatus === 'rejected' ? 'bg-[#FEE2E2] border-[#FECACA] text-[#991B1B]' :
                'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#1B3A6B]'
              }`}
            >
              {s.rollNumber}
              {s.verificationStatus === 'approved' && ' ✓'}
              {s.verificationStatus === 'rejected' && ' ✗'}
            </button>
          ))}
          {pendingCount === 0 && (
            <span className="ml-2 text-xs font-semibold text-[#059669]">All sheets reviewed!</span>
          )}
        </div>
      </Card>

      {/* Main verification layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Answer sheet image */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0F172A]">Answer Sheet Preview</h3>
            <ConfidenceBadge confidence={activeSheet.overallConfidence} />
          </div>
          <AnswerSheetPreview sheet={merged as AnswerSheetOCR} highlight={highlightField} />
          <Alert variant="info"
            message={`OCR overall confidence: ${activeSheet.overallConfidence}. Fields highlighted in red/amber need review.`} />
        </div>

        {/* Right: Extracted data form */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#0F172A]">Extracted Data — Review & Correct</h3>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {fieldDefs.map(f => {
              const conf = activeSheet.fieldConfidences[f.key] as OCRConfidence
              const val = (merged as any)[f.key] || ''
              const isEdited = editFields[f.key as keyof AnswerSheetOCR] !== undefined
              return (
                <div key={f.key}
                  className={`relative rounded-lg border p-3 transition-all ${
                    conf === 'Low' ? 'border-[#FECACA] bg-[#FEF2F2]' :
                    conf === 'Medium' ? 'border-[#FDE68A] bg-[#FFFBEB]' :
                    'border-[#E2E8F0] bg-white'
                  }`}
                  onMouseEnter={() => setHighlightField(f.key)}
                  onMouseLeave={() => setHighlightField(undefined)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#475569] uppercase tracking-wide">{f.label}</label>
                    <div className="flex items-center gap-1.5">
                      {isEdited && <span className="text-[10px] font-semibold text-[#3B5DE8] uppercase">Edited</span>}
                      <ConfidenceBadge confidence={conf} />
                    </div>
                  </div>
                  <input
                    value={val}
                    onChange={e => setEditFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full text-sm text-[#0F172A] bg-transparent outline-none border-b border-dashed border-[#CBD5E1] pb-0.5 focus:border-[#3B5DE8]"
                  />
                  {conf === 'Low' && (
                    <p className="text-[10px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertTriangleIcon size={10} /> Low confidence — please verify manually
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="danger" size="md" fullWidth onClick={handleReject} leftIcon={<XIcon size={14} />}>
              Reject Sheet
            </Button>
            <Button variant="success" size="md" fullWidth onClick={handleApprove} leftIcon={<CheckIcon size={14} />}>
              Approve & Continue
            </Button>
          </div>
          {pendingCount === 0 && (
            <Button variant="primary" size="md" fullWidth onClick={onNext}>
              All Verified — Proceed to Student Mapping →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Step 5: Student Mapping ──────────────────────────────────────────────────
