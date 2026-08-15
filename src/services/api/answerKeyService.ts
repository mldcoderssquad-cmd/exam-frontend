// src/services/api/answerKeyService.ts

import axios from 'axios'
import { AnswerKey, AnswerKeyListItem } from '@/types'

const API_URL = 'http://127.0.0.1:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('exam_evaluate_token')
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
}

export const answerKeyService = {
  create: async (data: any): Promise<AnswerKey> => {
    try {
      const response = await axios.post(
        `${API_URL}/answer-key/create`,
        data,
        getAuthHeader()
      )
      return response.data.data
    } catch (error: any) {
      console.error('❌ Create answer key error:', error.response?.data || error.message)
      throw error
    }
  },

  list: async (): Promise<AnswerKeyListItem[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/answer-key/list`,
        getAuthHeader()
      )
      return response.data.data
    } catch (error: any) {
      console.error('❌ List answer keys error:', error.response?.data || error.message)
      throw error
    }
  },

  getById: async (id: string): Promise<AnswerKey> => {
    try {
      const response = await axios.get(
        `${API_URL}/answer-key/${id}`,
        getAuthHeader()
      )
      return response.data.data
    } catch (error: any) {
      console.error('❌ Get answer key error:', error.response?.data || error.message)
      throw error
    }
  },

  update: async (id: string, data: any): Promise<AnswerKey> => {
    try {
      const response = await axios.put(
        `${API_URL}/answer-key/${id}`,
        data,
        getAuthHeader()
      )
      return response.data.data
    } catch (error: any) {
      console.error('❌ Update answer key error:', error.response?.data || error.message)
      throw error
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(
        `${API_URL}/answer-key/${id}`,
        getAuthHeader()
      )
    } catch (error: any) {
      console.error('❌ Delete answer key error:', error.response?.data || error.message)
      throw error
    }
  },

  getBySubject: async (subject: string): Promise<AnswerKeyListItem[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/answer-key/subject/${subject}`,
        getAuthHeader()
      )
      return response.data.data
    } catch (error: any) {
      console.error('❌ Get by subject error:', error.response?.data || error.message)
      throw error
    }
  },
}