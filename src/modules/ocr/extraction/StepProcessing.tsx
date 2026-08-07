import { useState, useEffect } from 'react'
import { Card, CardHeader, Alert, Spinner } from '@/components/common'
import { AnswerSheetPreview } from '../shared'
import { MOCK_SHEETS } from '@/services/ocr/mockData'

export default function StepProcessing({ onNext }: { onNext: () => void }) {
  const [processed, setProcessed] = useState(0)
  const total = MOCK_SHEETS.length
  const [currentSheet, setCurrentSheet] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessed(prev => {
        const next = prev + 1
        setCurrentSheet(Math.min(next, total - 1))
        if (next >= total) {
          clearInterval(interval)
          setDone(true)
          setTimeout(onNext, 1200)
        }
        return next
      })
    }, 900)
    return () => clearInterval(interval)
  }, [])

  const pct = Math.round((processed / total) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col items-center text-center py-6 gap-6">
          {/* Animated icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-[#EEF4FF] flex items-center justify-center">
              <div className={`w-20 h-20 rounded-full border-4 border-t-[#1B3A6B] border-[#E2E8F0] ${done ? '' : 'animate-spin-slow'}`} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-[#1B3A6B]">{pct}%</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              {done ? 'OCR Complete!' : 'OCR Processing in Progress…'}
            </h2>
            <p className="text-sm text-[#475569] mt-1">
              {done ? `All ${total} answer sheets processed successfully.` : `Extracting text from answer sheets using optical character recognition.`}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm">
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: done ? '#059669' : '#1B3A6B' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-[#94A3B8]">
              <span>{processed} of {total} sheets processed</span>
              <span>{total - processed} remaining</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 text-center">
            {[
              { label: 'Sheets Queued', value: total },
              { label: 'Processed', value: processed, color: '#059669' },
              { label: 'Remaining', value: total - processed, color: '#D97706' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold" style={{ color: stat.color ?? '#0F172A' }}>{stat.value}</div>
                <div className="text-xs text-[#94A3B8] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Current sheet preview */}
      {!done && (
        <Card>
          <CardHeader title={`Processing Sheet ${currentSheet + 1} of ${total}`} subtitle={MOCK_SHEETS[currentSheet]?.filename} />
          <div className="max-w-sm">
            <AnswerSheetPreview sheet={MOCK_SHEETS[currentSheet]} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Detecting fields…', 'Extracting text…', 'Confidence scoring…'].map((s, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                i === 0 ? 'bg-[#1B3A6B] text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'
              }`}>
                {i === 0 && <Spinner size="sm" color="white" />}
                {s}
              </span>
            ))}
          </div>
        </Card>
      )}

      {done && (
        <Alert variant="success" title="OCR Complete"
          message={`${total} answer sheets have been processed. Proceed to review the extracted data.`} />
      )}
    </div>
  )
}
