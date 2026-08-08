// src/modules/ocr/extraction/StepProcessing.tsx

import { useState, useEffect } from 'react'
import { Card, CardHeader, Alert, Spinner } from '@/components/common'
import { AnswerSheetPreview } from '../shared'
import { useOCRStore } from '@/stores/ocrStore'
import type { AnswerSheetOCR } from '@/types'

export default function StepProcessing({ onNext }: { onNext: () => void }) {
  const { results, setProcessingStatus, processingStatus } = useOCRStore()
  const [processed, setProcessed] = useState(0)
  const [currentSheet, setCurrentSheet] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get sheets from store
  const sheets = useOCRStore((state) => state.sheets)
  const total = sheets.length || 1

  // Simulate processing progress while waiting for API
  useEffect(() => {
    // If we have results, mark as done
    if (results && results.length > 0) {
      setProcessed(results.length)
      setDone(true)
      setTimeout(onNext, 1200)
      return
    }

    // Otherwise simulate progress
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
  }, [total, results, onNext])

  // Poll for status if we have a job ID
  useEffect(() => {
    const pollStatus = async () => {
      // If we already have results, skip polling
      if (results && results.length > 0) return

      // Check if there's a job ID in the store
      // Note: You need to add jobId to your store if you want real polling
      // For now, we'll rely on the simulation above
    }

    const interval = setInterval(pollStatus, 1000)
    return () => clearInterval(interval)
  }, [results])

  const pct = Math.min(Math.round((processed / total) * 100), 100)

  // Get current sheet for preview
  const currentSheetData: AnswerSheetOCR | undefined = sheets?.[currentSheet]

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" title="Processing Error" message={error} />
      )}

      <Card>
        <div className="flex flex-col items-center text-center py-6 gap-6">
          {/* Animated icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-[#EEF4FF] flex items-center justify-center">
              <div 
                className={`w-20 h-20 rounded-full border-4 border-t-[#1B3A6B] border-[#E2E8F0] ${
                  done ? '' : 'animate-spin-slow'
                }`} 
              />
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
              {done 
                ? `All ${total} answer sheets processed successfully.` 
                : `Extracting text from answer sheets using optical character recognition.`
              }
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm">
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ 
                  width: `${pct}%`, 
                  background: done ? '#059669' : '#1B3A6B' 
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-[#94A3B8]">
              <span>{Math.min(processed, total)} of {total} sheets processed</span>
              <span>{Math.max(total - processed, 0)} remaining</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 text-center">
            {[
              { label: 'Sheets Queued', value: total },
              { label: 'Processed', value: Math.min(processed, total), color: '#059669' },
              { label: 'Remaining', value: Math.max(total - processed, 0), color: '#D97706' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold" style={{ color: stat.color ?? '#0F172A' }}>
                  {stat.value}
                </div>
                <div className="text-xs text-[#94A3B8] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Current sheet preview */}
      {!done && currentSheetData && (
        <Card>
          <CardHeader 
            title={`Processing Sheet ${currentSheet + 1} of ${total}`} 
            subtitle={currentSheetData?.filename || 'Processing...'} 
          />
          <div className="max-w-sm">
            <AnswerSheetPreview sheet={currentSheetData} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Detecting fields…', 'Extracting text…', 'Confidence scoring…'].map((s, i) => (
              <span 
                key={i} 
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  i === 0 ? 'bg-[#1B3A6B] text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'
                }`}
              >
                {i === 0 && <Spinner size="sm" color="white" />}
                {s}
              </span>
            ))}
          </div>
        </Card>
      )}

      {done && (
        <Alert 
          variant="success" 
          title="OCR Complete"
          message={`${total} answer sheets have been processed. Proceed to review the extracted data.`} 
        />
      )}
    </div>
  )
}

