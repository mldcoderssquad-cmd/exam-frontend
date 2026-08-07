import { useState } from 'react'
import { Card, Button, Alert, ChevronRightIcon, Input, Modal, SearchIcon } from '@/components/common'
import { MappingBadge } from '../shared'
import { MOCK_STUDENT_DB } from '@/services/ocr/mockData'
import type { AnswerSheetOCR, MappingStatus } from '@/types'

export default function StepMapping({ sheets, onSheetsUpdate, onNext }: {
  sheets: AnswerSheetOCR[]
  onSheetsUpdate: (s: AnswerSheetOCR[]) => void
  onNext: () => void
}) {
  const [manualMapping, setManualMapping] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mappingSheet, setMappingSheet] = useState<AnswerSheetOCR | null>(null)

  const filteredStudents = MOCK_STUDENT_DB.filter(s => {
    const q = searchQuery.toLowerCase()
    return !q || s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.cuid.toLowerCase().includes(q)
  })

  const mappingConfidence: Record<MappingStatus, number> = {
    'Mapped': 97,
    'Needs Review': 71,
    'Not Found': 0,
  }

  const handleManualMap = (sheet: AnswerSheetOCR, studentId: string) => {
    const student = MOCK_STUDENT_DB.find(s => s.id === studentId)
    if (!student) return
    const updated = sheets.map(s => s.id === sheet.id ? { ...s, mappingStatus: 'Mapped' as const, mappedStudentId: studentId } : s)
    onSheetsUpdate(updated)
    setManualMapping(null)
    setMappingSheet(null)
  }

  const allMapped = sheets.every(s => s.mappingStatus === 'Mapped')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {(['Mapped', 'Needs Review', 'Not Found'] as MappingStatus[]).map(status => {
          const count = sheets.filter(s => s.mappingStatus === status).length
          const colors = {
            'Mapped': { bg: '#D1FAE5', text: '#059669' },
            'Needs Review': { bg: '#FEF3C7', text: '#D97706' },
            'Not Found': { bg: '#FEE2E2', text: '#DC2626' },
          }[status]
          return (
            <Card key={status} className="text-center py-4">
              <div className="text-2xl font-bold" style={{ color: colors.text }}>{count}</div>
              <div className="text-xs text-[#94A3B8] mt-1"><MappingBadge status={status} /></div>
            </Card>
          )
        })}
      </div>

      {sheets.some(s => s.mappingStatus !== 'Mapped') && (
        <Alert variant="warning" title="Manual Mapping Required"
          message="Some answer sheets could not be automatically matched to student records. Review and manually map them before proceeding." />
      )}

      <Card padding={false}>
        <div className="p-5 border-b border-[#E2E8F0]">
          <h3 className="text-base font-semibold text-[#0F172A]">Examination Record Mapping</h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">Extracted student data matched against the enrolled student database.</p>
        </div>
        <div className="divide-y divide-[#F1F5F9]">
          {sheets.map(sheet => {
            const matched = MOCK_STUDENT_DB.find(s => s.id === sheet.mappedStudentId)
            const conf = mappingConfidence[sheet.mappingStatus]
            return (
              <div key={sheet.id} className="p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Extracted */}
                  <div className="flex-1 min-w-48">
                    <div className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Extracted from Sheet</div>
                    <div className="text-sm font-semibold text-[#0F172A]">{sheet.studentName}</div>
                    <div className="text-xs text-[#475569]">{sheet.rollNumber} · {sheet.cuid || 'No CUID'}</div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center self-center text-[#94A3B8]">
                    <ChevronRightIcon size={20} />
                  </div>

                  {/* Matched record */}
                  <div className="flex-1 min-w-48">
                    <div className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Matched Student Record</div>
                    {matched ? (
                      <>
                        <div className="text-sm font-semibold text-[#0F172A]">{matched.name}</div>
                        <div className="text-xs text-[#475569]">{matched.rollNumber} · {matched.cuid}</div>
                      </>
                    ) : (
                      <div className="text-sm text-[#DC2626] font-medium">No match found</div>
                    )}
                  </div>

                  {/* Status & confidence */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <MappingBadge status={sheet.mappingStatus} />
                    {conf > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${conf}%`,
                            background: conf >= 90 ? '#059669' : conf >= 60 ? '#D97706' : '#DC2626'
                          }} />
                        </div>
                        <span className="text-xs text-[#94A3B8] font-medium">{conf}%</span>
                      </div>
                    )}
                    {sheet.mappingStatus !== 'Mapped' && (
                      <button
                        onClick={() => { setMappingSheet(sheet); setManualMapping(sheet.id); setSearchQuery('') }}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#1B3A6B] bg-[#EEF4FF] hover:bg-[#BACFFB] transition-colors"
                      >
                        Map Manually
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={onNext} disabled={!allMapped} leftIcon={<ChevronRightIcon size={16} />}>
          {allMapped ? 'Proceed to AI Evaluation' : `${sheets.filter(s => s.mappingStatus !== 'Mapped').length} sheets unmapped`}
        </Button>
      </div>

      {/* Manual mapping modal */}
      <Modal open={manualMapping !== null} onClose={() => { setManualMapping(null); setMappingSheet(null) }} maxWidth="max-w-lg">
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Manual Student Mapping</h3>
            <p className="text-sm text-[#475569] mt-0.5">
              Search and select the correct student for: <strong>{mappingSheet?.studentName}</strong> ({mappingSheet?.rollNumber})
            </p>
          </div>
          <Input
            placeholder="Search by name, roll number, or CUID…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<SearchIcon size={16} />}
          />
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => mappingSheet && handleManualMap(mappingSheet, student.id)}
                className="w-full text-left p-3 rounded-lg border border-[#E2E8F0] hover:border-[#1B3A6B] hover:bg-[#EEF4FF] transition-all"
              >
                <div className="text-sm font-semibold text-[#0F172A]">{student.name}</div>
                <div className="text-xs text-[#475569]">{student.rollNumber} · {student.cuid} · {student.program}</div>
              </button>
            ))}
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-[#94A3B8] text-sm">No students found.</div>
            )}
          </div>
          <Button variant="secondary" size="md" fullWidth onClick={() => { setManualMapping(null); setMappingSheet(null) }}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
