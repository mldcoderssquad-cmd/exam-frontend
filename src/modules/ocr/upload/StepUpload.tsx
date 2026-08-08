// src/modules/ocr/upload/StepUpload.tsx

import { useState, useRef, useCallback } from 'react'
import { Card, CardHeader, Button, Alert, SectionLabel, Spinner, AlertCircleIcon, CheckIcon } from '@/components/common'
import { MOCK_EXAMINATIONS } from '@/services/ocr/mockData'
import { examService } from '@/services/api/examService'
import { useOCRStore } from '@/stores/ocrStore'

// ─── Types ───────────────────────────────────────────────────────────
interface UploadFile { 
  name: string; 
  size: string; 
  progress: number; 
  status: 'queued' | 'uploading' | 'done' | 'error';
  file: File;
}

export default function StepUpload({ onNext }: { onNext: () => void }) {
  const [selectedExam, setSelectedExam] = useState('')
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── File handling ───────────────────────────────────────────────────
  const addFiles = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList)
    const newFiles = filesArray.map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 0,
      status: 'queued' as const,
      file: file,
    }))
    setFiles(prev => [...prev, ...newFiles])
    setError(null)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files
    if (dropped.length) addFiles(dropped)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files
    if (picked && picked.length) addFiles(picked)
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllFiles = () => {
    setFiles([])
    setError(null)
  }

  // ─── Upload handler ───────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedExam) {
      setError('Please select an examination first.')
      return
    }
    
    if (files.length === 0) {
      setError('Please upload at least one answer sheet.')
      return
    }

    // Check if any files are still queued or uploading
    const hasQueued = files.some(f => f.status === 'queued')
    if (hasQueued) {
      setError('Please wait for all files to be ready.')
      return
    }

    setUploading(true)
    setError(null)
    
    try {
      // Update all files to uploading status
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })))

      // Get answer key from selected exam
      const exam = MOCK_EXAMINATIONS.find(e => e.id === selectedExam)
      const answerKey = exam ? `Exam: ${exam.name}\n\nQ1. What is Machine Learning?\nAns. Machine Learning is a subset of AI...` : ''

      // Get actual File objects
      const pdfFiles = files.map(f => f.file)

      // Call API
      const response = await examService.processBatch(answerKey, pdfFiles)

      // Update files to done
      setFiles(prev => prev.map(f => ({ ...f, progress: 100, status: 'done' as const })))

      // Store results in store
      const { setResults, setSummary, setSheets, setQuestions } = useOCRStore.getState()
      
      // Transform results
      const sheets = response.results.map((result: any) => ({
        id: `sheet_${result.roll || result.student_name}`,
        filename: result.filename || 'unknown.pdf',
        studentName: result.student_name || 'Unknown',
        rollNumber: result.roll || 'N/A',
        cuid: `CU${result.roll || '0000'}`,
        program: 'B.Tech',
        branch: 'Computer Science',
        courseName: 'Machine Learning',
        courseCode: 'ML101',
        fatherName: '',
        overallConfidence: 'High' as const,
        fieldConfidences: {},
        verificationStatus: 'pending' as const,
        mappingStatus: 'Mapped' as const,
        mappedStudentId: result.roll || '',
      }))

      setResults(response.results)
      setSummary(response.summary)
      setSheets(sheets)

      // Navigate to results after a short delay
      setTimeout(() => {
        onNext()
      }, 500)

    } catch (err) {
      console.error('Upload failed:', err)
      setError(err instanceof Error ? err.message : 'Processing failed. Please try again.')
      
      // Mark errored files
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' as const })))
    } finally {
      setUploading(false)
    }
  }

  const allDone = files.length > 0 && files.every(f => f.status === 'done')
  const canStart = selectedExam && files.length > 0 && !uploading

  // ─── Icons ────────────────────────────────────────────────────────────
  function UploadCloudIcon({ size = 24 }: { size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
      </svg>
    )
  }

  function FileIcon({ size = 16 }: { size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Error display */}
      {error && (
        <Alert variant="error" title="Error" message={error} />
      )}

      {/* Select Examination */}
      <Card>
        <CardHeader title="Select Examination" subtitle="Choose the examination this batch of answer sheets belongs to" />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#0F172A]">Examination <span className="text-[#DC2626]">*</span></label>
          <select
            value={selectedExam}
            onChange={e => setSelectedExam(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] bg-white focus:border-[#3B5DE8] focus:ring-2 focus:ring-[#3B5DE8]/20 outline-none"
          >
            <option value="">— Select an examination —</option>
            {MOCK_EXAMINATIONS.map(e => (
              <option key={e.id} value={e.id}>
                {e.code} — {e.name} (Sem {e.semester} · {e.date})
              </option>
            ))}
          </select>
          {selectedExam && (() => {
            const exam = MOCK_EXAMINATIONS.find(e => e.id === selectedExam)!
            return (
              <div className="flex flex-wrap gap-4 mt-3 p-3 rounded-lg bg-[#EEF4FF] border border-[#BACFFB] text-xs text-[#1B3A6B]">
                <span><strong>Department:</strong> {exam.department}</span>
                <span><strong>Total Students:</strong> {exam.totalStudents}</span>
                <span><strong>Exam Date:</strong> {exam.date}</span>
                <span className={`font-semibold ${exam.status === 'Active' ? 'text-[#059669]' : 'text-[#D97706]'}`}>{exam.status}</span>
              </div>
            )
          })()}
        </div>
      </Card>

      {/* Upload */}
      <Card>
        <CardHeader title="Upload Answer Sheets" subtitle="PDF files. Max 50 MB per file." />

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragging ? 'border-[#3B5DE8] bg-[#EEF4FF]' : 'border-[#E2E8F0] hover:border-[#93A9F9] hover:bg-[#F8FAFC]'
          }`}
        >
          <input ref={fileInputRef} type="file" multiple accept=".pdf" className="hidden" onChange={handleFileInput} />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${dragging ? 'bg-[#3B5DE8] text-white' : 'bg-[#EEF4FF] text-[#3B5DE8]'}`}>
              <UploadCloudIcon size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                {dragging ? 'Drop files here' : 'Drag & drop answer sheets'}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">or click to browse · PDF only</p>
            </div>
          </div>
        </div>

        {/* File queue */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#0F172A]">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
              {!uploading && (
                <button 
                  onClick={clearAllFiles} 
                  className="text-xs text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] flex items-center justify-center shrink-0">
                    <FileIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[#0F172A] truncate">{f.name}</span>
                      <span className="text-xs text-[#94A3B8] shrink-0">{f.size}</span>
                    </div>
                    {f.status !== 'queued' && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1B3A6B] rounded-full transition-all duration-300" style={{ width: `${f.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-[#94A3B8] shrink-0">{f.progress}%</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    {f.status === 'queued' && (
                      <span className="text-[10px] text-[#94A3B8] font-medium uppercase">Queued</span>
                    )}
                    {f.status === 'uploading' && <Spinner size="sm" color="navy" />}
                    {f.status === 'done' && <CheckIcon size={16} className="text-[#059669]" />}
                    {f.status === 'error' && <AlertCircleIcon size={16} className="text-[#DC2626]" />}
                    {f.status === 'queued' && !uploading && (
                      <button 
                        onClick={() => removeFile(i)}
                        className="text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Upload button */}
      <div className="flex gap-3 justify-end">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleUpload} 
          disabled={!canStart} 
          loading={uploading}
        >
          {uploading ? 'Processing…' : 'Upload & Start OCR'}
        </Button>
      </div>
    </div>
  )
}

// export default StepUpload