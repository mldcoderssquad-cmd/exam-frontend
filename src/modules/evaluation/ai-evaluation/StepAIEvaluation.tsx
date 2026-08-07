import { useState } from 'react'
import { Card, Button, Alert, CheckIcon, ChevronRightIcon, EditIcon, XIcon } from '@/components/common'
import type { QuestionMark, AnswerSheetOCR } from '@/types'
import { AnswerSheetPreview, ConfidenceBadge } from '@/modules/ocr/shared'

export default function StepAIEvaluation({ sheet, questions, onQuestionsUpdate, onNext }: {
  sheet: AnswerSheetOCR
  questions: QuestionMark[]
  onQuestionsUpdate: (q: QuestionMark[]) => void
  onNext: () => void
}) {
  const [editingQ, setEditingQ] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const totalMax = questions.reduce((sum, q) => sum + q.maxMarks, 0)
  const totalAI = questions.reduce((sum, q) => sum + q.aiMarks, 0)
  const totalFaculty = questions.reduce((sum, q) => sum + (q.facultyMarks ?? q.aiMarks), 0)
  const overrideCount = questions.filter(q => q.facultyMarks !== null).length

  const handleEditSave = (qNo: number) => {
    const val = parseFloat(editValue)
    const q = questions.find(q => q.questionNo === qNo)
    if (!q || isNaN(val) || val < 0 || val > q.maxMarks) return
    onQuestionsUpdate(questions.map(q => q.questionNo === qNo ? { ...q, facultyMarks: val } : q))
    setEditingQ(null)
  }

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Questions', value: questions.length, sub: '', color: '#1B3A6B' },
          { label: 'AI Total Marks', value: `${totalAI}/${totalMax}`, sub: `${Math.round(totalAI / totalMax * 100)}%`, color: '#3B5DE8' },
          { label: 'Faculty Marks', value: `${totalFaculty}/${totalMax}`, sub: overrideCount > 0 ? `${overrideCount} overrides` : 'AI marks accepted', color: '#059669' },
          { label: 'Overridden', value: overrideCount, sub: 'by faculty', color: '#D97706' },
        ].map(s => (
          <Card key={s.label} className="py-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            {s.sub && <div className="text-[10px] text-[#94A3B8] mt-0.5">{s.sub}</div>}
            <div className="text-xs text-[#94A3B8] mt-1 font-medium">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Answer sheet preview */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-[#0F172A]">Answer Sheet</h3>
          <div className="p-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <div className="text-xs text-[#94A3B8] px-1 pb-1 font-medium">{sheet.studentName} · {sheet.rollNumber}</div>
            <AnswerSheetPreview sheet={sheet} />
          </div>
          <Alert variant="info"
            message="AI has evaluated all answers. You may override any mark. Modified marks will be highlighted." />
        </div>

        {/* Question-wise marks */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Question-wise AI Evaluation</h3>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {questions.map(q => {
              const effectiveMark = q.facultyMarks ?? q.aiMarks
              const isEditing = editingQ === q.questionNo
              const isOverridden = q.facultyMarks !== null

              return (
                <div key={q.questionNo} className={`rounded-xl border p-4 transition-all ${
                  isOverridden ? 'border-[#BACFFB] bg-[#EEF4FF]' :
                  q.confidence === 'Low' ? 'border-[#FECACA] bg-[#FEF2F2]' :
                  'border-[#E2E8F0] bg-white'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#1B3A6B] bg-[#EEF4FF] px-2 py-0.5 rounded-md">Q{q.questionNo}</span>
                        <ConfidenceBadge confidence={q.confidence} />
                        {isOverridden && (
                          <span className="text-[10px] font-bold text-[#3B5DE8] uppercase tracking-wide">Faculty Override</span>
                        )}
                        {q.confidence === 'Low' && (
                          <span className="text-[10px] font-semibold text-[#DC2626]">⚠ Review recommended</span>
                        )}
                      </div>
                      <p className="text-xs text-[#475569] mt-2 leading-relaxed">{q.aiComment}</p>
                    </div>

                    {/* Marks */}
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-[#94A3B8] mb-1">Max: {q.maxMarks}</div>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={q.maxMarks}
                            step={0.5}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="w-14 h-7 text-center text-sm border border-[#3B5DE8] rounded-md outline-none"
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleEditSave(q.questionNo); if (e.key === 'Escape') setEditingQ(null) }}
                          />
                          <button onClick={() => handleEditSave(q.questionNo)} className="text-[#059669] hover:text-[#047857]"><CheckIcon size={14} /></button>
                          <button onClick={() => setEditingQ(null)} className="text-[#94A3B8] hover:text-[#DC2626]"><XIcon size={14} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-xs text-[#94A3B8]">AI: {q.aiMarks}</div>
                            <div className={`text-lg font-bold ${isOverridden ? 'text-[#1B3A6B]' : 'text-[#0F172A]'}`}>
                              {effectiveMark}
                            </div>
                          </div>
                          <button
                            onClick={() => { setEditingQ(q.questionNo); setEditValue(String(effectiveMark)) }}
                            className="p-1 rounded-md text-[#94A3B8] hover:text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors"
                            title="Override mark"
                          >
                            <EditIcon size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Marks bar */}
                  <div className="mt-2 h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${(effectiveMark / q.maxMarks) * 100}%`,
                        background: isOverridden ? '#1B3A6B' : q.confidence === 'Low' ? '#D97706' : '#059669'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total row */}
          <div className="mt-4 p-4 rounded-xl bg-[#0F2142] text-white flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Total Marks</div>
              <div className="text-xs text-blue-300 mt-0.5">{overrideCount > 0 ? `${overrideCount} mark${overrideCount > 1 ? 's' : ''} overridden by faculty` : 'AI evaluation accepted as-is'}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{totalFaculty}<span className="text-lg text-blue-300">/{totalMax}</span></div>
              <div className="text-xs text-blue-300">{Math.round(totalFaculty / totalMax * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={onNext} leftIcon={<ChevronRightIcon size={16} />}>
          Proceed to Faculty Verification
        </Button>
      </div>
    </div>
  )
}
