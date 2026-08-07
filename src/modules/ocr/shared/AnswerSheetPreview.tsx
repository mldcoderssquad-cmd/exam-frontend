import type { AnswerSheetOCR } from '@/types'

export function AnswerSheetPreview({ sheet, highlight }: { sheet: AnswerSheetOCR; highlight?: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden text-[11px] font-mono select-none shadow-sm">
      {/* Sheet header */}
      <div className="bg-[#0F2142] text-white px-4 py-2 flex items-center justify-between">
        <span className="font-bold text-xs tracking-wide">COER UNIVERSITY</span>
        <span className="text-blue-300 text-[10px]">Answer Book</span>
      </div>
      <div className="px-4 pt-3 pb-2 border-b border-dashed border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {[
            { label: 'Program', val: sheet.program, field: 'program' },
            { label: 'Branch', val: sheet.branch, field: 'branch' },
            { label: 'Student Name', val: sheet.studentName, field: 'studentName' },
            { label: 'Father Name', val: sheet.fatherName, field: 'fatherName' },
            { label: 'Roll No.', val: sheet.rollNumber, field: 'rollNumber' },
            { label: 'CUID', val: sheet.cuid || '—', field: 'cuid' },
            { label: 'Course', val: sheet.courseName, field: 'courseName' },
            { label: 'Code', val: sheet.courseCode, field: 'courseCode' },
          ].map(f => (
            <div key={f.label} className={`${highlight === f.field ? 'bg-amber-100 -mx-1 px-1 rounded' : ''}`}>
              <span className="text-[#94A3B8]">{f.label}: </span>
              <span className={`font-semibold ${
                sheet.fieldConfidences[f.field] === 'Low' ? 'text-[#DC2626] underline decoration-dotted' :
                sheet.fieldConfidences[f.field] === 'Medium' ? 'text-[#D97706]' : 'text-[#0F172A]'
              }`}>{f.val}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Fake answer lines */}
      <div className="px-4 py-3 space-y-2">
        <div className="text-[#94A3B8] text-[10px] mb-1">Q1. Explain the time complexity of QuickSort…</div>
        {[90, 75, 85, 60, 80, 70, 65].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            <div className="h-2 rounded-sm bg-[#94A3B8]/40" style={{ width: `${w}%`, maxWidth: 180 }} />
          </div>
        ))}
        <div className="text-[#94A3B8] text-[10px] mt-2">Q2. Prove that P ≠ NP using reduction…</div>
        {[80, 55, 90, 70].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            <div className="h-2 rounded-sm bg-[#94A3B8]/40" style={{ width: `${w}%`, maxWidth: 180 }} />
          </div>
        ))}
      </div>
      <div className="px-4 pb-3 text-right text-[10px] text-[#94A3B8] border-t border-dashed border-[#E2E8F0] pt-2">
        Page 1 of 8 · {sheet.filename}
      </div>
    </div>
  )
}
