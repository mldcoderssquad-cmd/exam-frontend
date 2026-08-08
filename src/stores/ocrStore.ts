// src/stores/ocrStore.ts

import { create } from 'zustand'
import { StudentResult, ProcessBatchResponse } from '@/services/api/examService'
import { AnswerSheetOCR, QuestionMark } from '@/types'

interface OCRStore {
  // State
  results: StudentResult[]
  summary: ProcessBatchResponse['summary'] | null
  sheets: AnswerSheetOCR[]
  questions: QuestionMark[]
  jobId: string | null
  processingStatus: {
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    message: string
  } | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setResults: (results: StudentResult[]) => void
  setSummary: (summary: ProcessBatchResponse['summary']) => void
  setSheets: (sheets: AnswerSheetOCR[]) => void
  setQuestions: (questions: QuestionMark[]) => void
  setJobId: (jobId: string) => void
  setProcessingStatus: (status: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Update functions
  updateVerificationStatus: (sheetId: string, status: 'approved' | 'rejected') => void
  updateSheetData: (sheetId: string, data: Partial<AnswerSheetOCR>) => void
  updateMappingStatus: (sheetId: string, status: 'Mapped' | 'Needs Review' | 'Not Found') => void
  
  reset: () => void
}

export const useOCRStore = create<OCRStore>((set) => ({
  results: [],
  summary: null,
  sheets: [],
  questions: [],
  jobId: null,
  processingStatus: null,
  isLoading: false,
  error: null,

  setResults: (results) => {
    // Transform API results to frontend sheets
    const sheets = results.map((result) => {
      // Calculate overall confidence from verification confidences
      const verified = result.verified || []
      const avgConfidence = verified.length > 0
        ? verified.reduce((acc, v) => acc + (v.confidence || 0), 0) / verified.length
        : 0.5

      const overallConfidence: 'High' | 'Medium' | 'Low' =
        avgConfidence >= 0.8 ? 'High' :
        avgConfidence >= 0.5 ? 'Medium' : 'Low'

      // Build field confidences from verified data
      const fieldConfidences: Record<string, 'High' | 'Medium' | 'Low'> = {}
      verified.forEach((v) => {
        const conf = v.confidence || 0
        fieldConfidences[v.question_number] =
          conf >= 0.8 ? 'High' :
          conf >= 0.5 ? 'Medium' : 'Low'
      })

      return {
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
        overallConfidence,
        fieldConfidences,
        verificationStatus: 'pending' as const,
        mappingStatus: 'Mapped' as const,
        mappedStudentId: result.roll || '',
      }
    })

    // Transform questions from first result
    const firstResult = results[0]
    if (firstResult) {
      const questions: QuestionMark[] = (firstResult.questions || []).map((q, index) => {
        const v = (firstResult.verified || []).find(
          (v) => v.question_number === q.question_number
        )
        return {
          id: `q_${index + 1}`,
          number: parseInt(q.question_number?.replace(/\D/g, '') || String(index + 1)),
          text: q.question_text || `Question ${index + 1}`,
          answer: q.model_answer || '',
          maxMarks: q.max_marks || 10,
          marksAwarded: v?.verified_marks || 0,
          feedback: v?.reason || '',
          isAttempted: q.is_attempted || false,
          confidence: v?.confidence || 0,
          hasDiagram: q.diagram_expected || false,
          diagramDescription: q.diagram_description || '',
        }
      })
      set({ questions })
    }

    set({ results, sheets })
  },
  
  setSummary: (summary) => set({ summary }),
  setSheets: (sheets) => set({ sheets }),
  setQuestions: (questions) => set({ questions }),
  setJobId: (jobId) => set({ jobId }),
  setProcessingStatus: (status) => set({ processingStatus: status }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  updateVerificationStatus: (sheetId, status) => {
    set((state) => ({
      sheets: state.sheets.map((s) =>
        s.id === sheetId ? { ...s, verificationStatus: status } : s
      ),
    }))
  },

  updateSheetData: (sheetId, data) => {
    set((state) => ({
      sheets: state.sheets.map((s) =>
        s.id === sheetId ? { ...s, ...data } : s
      ),
    }))
  },

  updateMappingStatus: (sheetId, status) => {
    set((state) => ({
      sheets: state.sheets.map((s) =>
        s.id === sheetId ? { ...s, mappingStatus: status } : s
      ),
    }))
  },

  reset: () =>
    set({
      results: [],
      summary: null,
      sheets: [],
      questions: [],
      jobId: null,
      processingStatus: null,
      isLoading: false,
      error: null,
    }),
}))