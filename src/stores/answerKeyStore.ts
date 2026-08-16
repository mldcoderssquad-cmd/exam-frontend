// src/stores/answerKeyStore.ts

import { create } from 'zustand'
import { AnswerKey, AnswerKeyListItem } from '@/types'
import { answerKeyService } from '@/services/api/answerKeyService'

interface AnswerKeyStore {
  answerKeys: AnswerKeyListItem[]
  currentAnswerKey: AnswerKey | null
  isLoading: boolean
  error: string | null
  selectedKeyId: string | null

  fetchAll: () => Promise<void>
  fetchById: (id: string) => Promise<AnswerKey | null>
  create: (data: any) => Promise<AnswerKey>
  update: (id: string, data: any) => Promise<AnswerKey>
  delete: (id: string) => Promise<void>
  selectForEvaluation: (id: string) => void
  reset: () => void
  getAnswerKeyContent: (id: string) => Promise<string>
}

export const useAnswerKeyStore = create<AnswerKeyStore>((set, get) => ({
  answerKeys: [],
  currentAnswerKey: null,
  isLoading: false,
  error: null,
  selectedKeyId: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await answerKeyService.list()
      set({ answerKeys: data, isLoading: false })
    } catch (error: any) {
      console.error('❌ Fetch all error:', error)
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch answer keys', 
        isLoading: false 
      })
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await answerKeyService.getById(id)
      set({ currentAnswerKey: data, isLoading: false })
      return data
    } catch (error: any) {
      console.error('❌ Fetch by ID error:', error)
      set({ 
        error: error.response?.data?.message || error.message || `Failed to fetch answer key ${id}`, 
        isLoading: false 
      })
      return null
    }
  },

  // ✅ FIXED: Send JSON format instead of text
  getAnswerKeyContent: async (id: string): Promise<string> => {
    try {
      const state = get()
      let key = state.currentAnswerKey
      
      if (!key || key.id !== id) {
        key = await state.fetchById(id)
      }
      
      if (!key || !key.questions || key.questions.length === 0) {
        throw new Error('Answer key has no questions')
      }

      // ✅ Build structured JSON object
      const jsonData = {
        name: key.name,
        subject: key.subject,
        department: key.department || '',
        semester: key.semester || 1,
        total_marks: key.total_marks || key.questions.reduce((sum: number, q: any) => sum + (q.max_marks || 10), 0),
        questions: key.questions.map((q: any) => ({
          id: q.id,
          question_number: q.question_number || `Q. No. ${q.id}`,
          question_text: q.question_text || q.text || '',
          model_answer: q.model_answer || q.answer || '',
          max_marks: q.max_marks || 10,
          question_type: q.question_type || 'theory',
          diagram_required: q.diagram_required || q.diagram_expected || false,
          diagram_weightage: q.diagram_weightage || 0,
          key_points: q.key_points || [],
          keywords: q.keywords || [],
          rubric: q.rubric || []
        }))
      }
      
      // Return as JSON string
      const jsonString = JSON.stringify(jsonData)
      
      console.log(`📤 Sending answer key as JSON`)
      console.log(`📤 Questions: ${jsonData.questions.length}`)
      console.log(`📤 JSON Length: ${jsonString.length} chars`)
      
      // ✅ Save debug info to localStorage for inspection
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const debugData = {
          timestamp: new Date().toISOString(),
          format: 'json',
          total_questions: jsonData.questions.length,
          question_preview: jsonData.questions.map((q: any) => ({
            id: q.id,
            question_number: q.question_number,
            question_text_preview: q.question_text.substring(0, 50) + '...',
            model_answer_length: q.model_answer.length
          }))
        }
        localStorage.setItem('last_answer_key_json_debug', JSON.stringify(debugData, null, 2))
        console.log('📝 Debug info saved to localStorage')
      } catch (e) {
        // Ignore localStorage errors
      }
      
      return jsonString
      
    } catch (error) {
      console.error('❌ Failed to get answer key content:', error)
      throw error
    }
  },

  create: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const result = await answerKeyService.create(data)
      set((state) => ({
        answerKeys: [...state.answerKeys, result],
        isLoading: false
      }))
      return result
    } catch (error: any) {
      console.error('❌ Create error:', error)
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to create answer key', 
        isLoading: false 
      })
      throw error
    }
  },

  update: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const result = await answerKeyService.update(id, data)
      set((state) => ({
        answerKeys: state.answerKeys.map((k) => (k.id === id ? result : k)),
        currentAnswerKey: result,
        isLoading: false
      }))
      return result
    } catch (error: any) {
      console.error('❌ Update error:', error)
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to update answer key', 
        isLoading: false 
      })
      throw error
    }
  },

  delete: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await answerKeyService.delete(id)
      set((state) => ({
        answerKeys: state.answerKeys.filter((k) => k.id !== id),
        isLoading: false
      }))
    } catch (error: any) {
      console.error('❌ Delete error:', error)
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to delete answer key', 
        isLoading: false 
      })
      throw error
    }
  },

  selectForEvaluation: (id: string) => {
    set({ selectedKeyId: id })
  },

  reset: () => {
    set({
      answerKeys: [],
      currentAnswerKey: null,
      isLoading: false,
      error: null,
      selectedKeyId: null,
    })
  },
}))