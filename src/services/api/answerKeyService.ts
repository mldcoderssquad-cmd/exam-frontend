// src/services/api/answerKeyService.ts

import axios from 'axios'

import type {
  AnswerKey,
  AnswerKeyListItem,
  AnswerKeyCreateData,
  AnswerKeySection,
  AnswerKeyQuestion,
} from '@/types'


// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL = 'http://127.0.0.1:5000/api'


// ============================================================
// AUTHENTICATED REQUEST CONFIG
// ============================================================
//
// Used ONLY for endpoints protected by @jwt_required().
// ============================================================

const getAuthConfig = () => {

  const token =
    localStorage.getItem('exam_evaluate_token')

  if (!token) {
    throw new Error(
      'Authentication token not found. Please login again.'
    )
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
}


// ============================================================
// PUBLIC REQUEST CONFIG
// ============================================================
//
// IMPORTANT:
// This configuration intentionally does NOT include JWT.
//
// Used by:
// POST /api/answer-key/public-create
// ============================================================

const getPublicConfig = () => {

  return {
    headers: {
      'Content-Type': 'application/json',
    },
  }
}


// ============================================================
// ANSWER NORMALIZATION HELPERS
// ============================================================
//
// These helpers prepare MCQ answers so that the backend/evaluator
// can recognize different ways a student may write the same option.
//
// Example:
// B
// b
// (B)
// B.
// II
// ii
// (ii)
// 2
// (2)
// Option B
// option b
// Option 2
// option 2
//
// All of these can represent option B.
// ============================================================

const ROMAN_BY_OPTION: Record<string, string> = {
  A: 'I',
  B: 'II',
  C: 'III',
  D: 'IV',
}

const OPTION_BY_ROMAN: Record<string, string> = {
  I: 'A',
  II: 'B',
  III: 'C',
  IV: 'D',
}

const OPTION_BY_NUMBER: Record<string, string> = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'D',
}


/**
 * Convert a raw answer into a simple normalized representation.
 */
const normalizeAnswer = (value: unknown): string => {

  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
    .trim()
    .replace(/\s+/g, ' ')
}


/**
 * Convert common MCQ answer formats into A/B/C/D.
 */
const canonicalizeMCQAnswer = (
  value: unknown
): string => {

  const raw = normalizeAnswer(value)

  if (!raw) {
    return ''
  }

  const upper = raw
    .toUpperCase()
    .trim()
    .replace(/^[\(\[\{]\s*/, '')
    .replace(/\s*[\)\]\}]$/, '')
    .replace(/\.$/, '')
    .trim()

  // ----------------------------------------------------------
  // Direct A/B/C/D
  // ----------------------------------------------------------

  if (
    upper === 'A' ||
    upper === 'B' ||
    upper === 'C' ||
    upper === 'D'
  ) {
    return upper
  }


  // ----------------------------------------------------------
  // Roman numerals
  // ----------------------------------------------------------

  if (OPTION_BY_ROMAN[upper]) {
    return OPTION_BY_ROMAN[upper]
  }


  // ----------------------------------------------------------
  // Numeric option
  // ----------------------------------------------------------

  if (OPTION_BY_NUMBER[upper]) {
    return OPTION_BY_NUMBER[upper]
  }


  // ----------------------------------------------------------
  // "OPTION A", "OPTION B", etc.
  // ----------------------------------------------------------

  const optionMatch =
    upper.match(/^OPTION\s+([ABCD]|I{1,3}|IV|[1-4])$/)

  if (optionMatch) {

    const optionValue =
      optionMatch[1]

    if (
      optionValue === 'A' ||
      optionValue === 'B' ||
      optionValue === 'C' ||
      optionValue === 'D'
    ) {
      return optionValue
    }

    if (OPTION_BY_ROMAN[optionValue]) {
      return OPTION_BY_ROMAN[optionValue]
    }

    if (OPTION_BY_NUMBER[optionValue]) {
      return OPTION_BY_NUMBER[optionValue]
    }
  }


  return ''
}


/**
 * Build all accepted representations for an MCQ option.
 *
 * Example for B:
 * [
 *   "B",
 *   "b",
 *   "(B)",
 *   "B.",
 *   "II",
 *   "ii",
 *   "(II)",
 *   "II.",
 *   "2",
 *   "(2)",
 *   "Option B",
 *   "option b",
 *   "Option 2",
 *   "option 2"
 * ]
 */
const buildAcceptedAnswers = (
  answer: unknown
): string[] => {

  const canonical =
    canonicalizeMCQAnswer(answer)

  if (!canonical) {
    const raw = normalizeAnswer(answer)

    return raw
      ? [raw]
      : []
  }

  const roman =
    ROMAN_BY_OPTION[canonical]

  const numeric =
    Object.entries(OPTION_BY_NUMBER)
      .find(
        ([, option]) =>
          option === canonical
      )?.[0]

  const accepted = [
    canonical,
    canonical.toLowerCase(),

    `(${canonical})`,
    `(${canonical.toLowerCase()})`,

    `${canonical}.`,
    `${canonical.toLowerCase()}.`,
  ]

  if (roman) {

    accepted.push(
      roman,
      roman.toLowerCase(),

      `(${roman})`,
      `(${roman.toLowerCase()})`,

      `${roman}.`,
      `${roman.toLowerCase()}.`,
    )
  }

  if (numeric) {

    accepted.push(
      numeric,
      `(${numeric})`,
      `${numeric}.`,
    )
  }

  if (roman) {

    accepted.push(
      `Option ${canonical}`,
      `option ${canonical}`,
      `OPTION ${canonical}`,

      `Option ${roman}`,
      `option ${roman}`,
      `OPTION ${roman}`,
    )
  }

  if (numeric) {

    accepted.push(
      `Option ${numeric}`,
      `option ${numeric}`,
      `OPTION ${numeric}`,
    )
  }

  return Array.from(
    new Set(
      accepted
        .map(value => value.trim())
        .filter(Boolean)
    )
  )
}


/**
 * Normalize one question before sending it to the backend.
 */
const normalizeQuestion = (
  question: AnswerKeyQuestion
): AnswerKeyQuestion => {

  const normalizedQuestion: AnswerKeyQuestion = {
    ...question,
  }


  // ----------------------------------------------------------
  // MCQ
  // ----------------------------------------------------------

  if (
    question.answer_type === 'MCQ' ||
    question.question_type === 'mcq' ||
    question.mcq_answer
  ) {

    const rawCorrectAnswer =
      question.mcq_answer?.correct_answer ??
      question.correct_answer ??
      question.model_answer ??
      ''

    const canonicalAnswer =
      canonicalizeMCQAnswer(
        rawCorrectAnswer
      )

    const existingAccepted =
      question.mcq_answer?.accepted_answers ??
      question.accepted_answers ??
      []

    const generatedAccepted =
      buildAcceptedAnswers(
        canonicalAnswer || rawCorrectAnswer
      )

    const acceptedAnswers =
      Array.from(
        new Set([
          ...generatedAccepted,
          ...existingAccepted.map(
            answer => normalizeAnswer(answer)
          ),
        ].filter(Boolean))
      )

    normalizedQuestion.answer_type = 'MCQ'

    normalizedQuestion.correct_answer =
      canonicalAnswer ||
      normalizeAnswer(rawCorrectAnswer)

    normalizedQuestion.accepted_answers =
      acceptedAnswers

    normalizedQuestion.mcq_answer = {
      ...(question.mcq_answer || {}),
      correct_answer:
        canonicalAnswer ||
        normalizeAnswer(rawCorrectAnswer),
      accepted_answers:
        acceptedAnswers,
    }

    // Store canonical answer as model answer too,
    // unless an actual explanation/model answer was supplied.
    if (
      !normalizedQuestion.model_answer ||
      canonicalAnswer
    ) {
      normalizedQuestion.model_answer =
        canonicalAnswer ||
        normalizedQuestion.model_answer
    }
  }


  return normalizedQuestion
}


// ============================================================
// SECTION NORMALIZATION
// ============================================================
//
// Converts the new section structure into a consistent payload.
//
// Example:
//
// Section A
//   MCQ
//   Total questions: 10
//   Questions to attempt: 10
//   Marks/question: 1
//
// Section B
//   LONG_ANSWER
//   Total questions: 2
//   Questions to attempt: 1
//   Marks/question: 10
//
// Section C
//   SHORT_ANSWER
//   Total questions: 3
//   Questions to attempt: 2
//   Marks/question: 5
// ============================================================

const normalizeSection = (
  section: AnswerKeySection,
  index: number
): AnswerKeySection => {

  const totalQuestions =
    Number(section.total_questions) || 0

  const questionsToAttempt =
    Number(section.questions_to_attempt) || 0

  const marksPerQuestion =
    Number(section.marks_per_question) || 0

  const questions =
    Array.isArray(section.questions)
      ? section.questions.map(
        normalizeQuestion
      )
      : []

  return {
    ...section,

    id:
      section.id ||
      `section-${index + 1}`,

    name:
      section.name ||
      `Section ${String.fromCharCode(65 + index)}`,

    total_questions:
      totalQuestions,

    questions_to_attempt:
      questionsToAttempt,

    marks_per_question:
      marksPerQuestion,

    questions,

    all_compulsory:
      section.all_compulsory ??
      (
        questionsToAttempt ===
        totalQuestions
      ),

    excess_attempt_policy:
      section.excess_attempt_policy ||
      'manual',
  }
}


// ============================================================
// COMPLETE PAYLOAD NORMALIZATION
// ============================================================

const normalizeCreatePayload = (
  data: AnswerKeyCreateData
): AnswerKeyCreateData => {

  const payload: AnswerKeyCreateData = {
    ...data,
  }


  // ----------------------------------------------------------
  // New section-based answer key
  // ----------------------------------------------------------

  if (
    Array.isArray(data.sections) &&
    data.sections.length > 0
  ) {

    const sections =
      data.sections.map(
        normalizeSection
      )

    payload.sections = sections


    // --------------------------------------------------------
    // Keep flat questions for backward compatibility.
    // --------------------------------------------------------

    const flattenedQuestions =
      sections.flatMap(
        section =>
          section.questions.map(
            question => ({
              ...question,
              section_id:
                question.section_id ||
                section.id,

              section_name:
                (question as any).section_name ||
                section.name,

              answer_type:
                question.answer_type ||
                section.type,
            })
          )
      )

    payload.questions =
      flattenedQuestions


    payload.total_questions =
      flattenedQuestions.length


    // --------------------------------------------------------
    // IMPORTANT:
    //
    // total_marks represents the marks actually evaluated,
    // based on questions_to_attempt.
    //
    // It must NOT simply be:
    // total number of available questions × marks.
    //
    // Example:
    //
    // A = 10 × 1 = 10
    // B = 1 × 10 = 10
    // C = 2 × 5 = 10
    //
    // Total = 30
    // --------------------------------------------------------

    const calculatedAttemptMarks =
      sections.reduce(
        (total, section) =>
          total +
          (
            Number(
              section.questions_to_attempt
            ) || 0
          ) *
          (
            Number(
              section.marks_per_question
            ) || 0
          ),
        0
      )

    if (
      !payload.total_marks ||
      Number(payload.total_marks) <= 0
    ) {
      payload.total_marks =
        calculatedAttemptMarks
    }
  }


  // ----------------------------------------------------------
  // Legacy flat answer key
  // ----------------------------------------------------------

  else if (
    Array.isArray(data.questions)
  ) {

    payload.questions =
      data.questions.map(
        normalizeQuestion
      )

    payload.total_questions =
      payload.questions.length
  }


  return payload
}


// ============================================================
// ANSWER KEY SERVICE
// ============================================================

export const answerKeyService = {


  // ==========================================================
  // AUTHENTICATED CREATE
  // ==========================================================
  //
  // POST:
  // /api/answer-key/create
  //
  // Requires JWT.
  // ==========================================================

  create: async (
    data: AnswerKeyCreateData
  ): Promise<AnswerKey> => {

    try {

      const payload =
        normalizeCreatePayload(data)

      console.log(
        '🔐 Creating authenticated answer key...'
      )

      console.log(
        '📦 Answer key payload:',
        payload
      )

      const response =
        await axios.post(
          `${API_URL}/answer-key/create`,
          payload,
          getAuthConfig()
        )

      return response.data.data

    } catch (error: any) {

      console.error(
        '❌ Authenticated create answer key error:',
        error.response?.data ||
        error.message
      )

      throw error
    }
  },


  // ==========================================================
  // PUBLIC CREATE
  // ==========================================================
  //
  // POST:
  // /api/answer-key/public-create
  //
  // IMPORTANT:
  // No login required.
  // No JWT required.
  //
  // This MUST be used by the public Answer Key Manager.
  // ==========================================================

  createPublic: async (
    data: AnswerKeyCreateData
  ): Promise<AnswerKey> => {

    try {

      const payload =
        normalizeCreatePayload(data)

      console.log(
        '🌐 Sending PUBLIC answer-key creation request...'
      )

      console.log(
        '🌐 Endpoint:',
        `${API_URL}/answer-key/public-create`
      )

      console.log(
        '📦 Public answer-key payload:',
        payload
      )

      const response =
        await axios.post(
          `${API_URL}/answer-key/public-create`,
          payload,
          getPublicConfig()
        )

      console.log(
        '✅ Public answer key created:',
        response.data
      )

      return response.data.data

    } catch (error: any) {

      console.error(
        '❌ Public create answer key error:',
        error.response?.data ||
        error.message
      )

      throw error
    }
  },


  // ==========================================================
  // AUTHENTICATED LIST
  // ==========================================================
  //
  // GET:
  // /api/answer-key/list
  //
  // Requires JWT.
  // ==========================================================

  list: async (): Promise<AnswerKeyListItem[]> => {

    try {

      const response =
        await axios.get(
          `${API_URL}/answer-key/list`,
          getAuthConfig()
        )

      return response.data.data

    } catch (error: any) {

      console.error(
        '❌ List answer keys error:',
        error.response?.data ||
        error.message
      )

      throw error
    }
  },


  // ==========================================================
  // AUTHENTICATED GET BY ID
  // ==========================================================
  //
  // GET:
  // /api/answer-key/<id>
  //
  // Requires JWT.
  // ==========================================================

  getById: async (
    id: string
  ): Promise<AnswerKey> => {

    try {

      if (!id) {
        throw new Error(
          'Answer key ID is required.'
        )
      }

      const response =
        await axios.get(
          `${API_URL}/answer-key/${encodeURIComponent(id)}`,
          getAuthConfig()
        )

      return response.data.data

    } catch (error: any) {

      console.error(
        '❌ Get answer key error:',
        error.response?.data ||
        error.message
      )

      throw error
    }
  },


  // ==========================================================
  // AUTHENTICATED UPDATE
  // ==========================================================
  //
  // PUT:
  // /api/answer-key/<id>
  //
  // Requires JWT.
  // ==========================================================

  update: async (
    id: string,
    data: Partial<AnswerKeyCreateData>
  ): Promise<AnswerKey> => {

    try {

      if (!id) {
        throw new Error(
          'Answer key ID is required.'
        )
      }

      const payload =
        normalizeCreatePayload(
          data as AnswerKeyCreateData
        )

      const response =
        await axios.put(
          `${API_URL}/answer-key/${encodeURIComponent(id)}`,
          payload,
          getAuthConfig()
        )

      return response.data.data

    } catch (error: any) {

      console.error(
        '❌ Update answer key error:',
        error.response?.data ||
        error.message
      )

      throw error
    }
  },


  // ==========================================================
  // AUTHENTICATED DELETE
  // ==========================================================
  //
  // DELETE:
  // /api/answer-key/<id>
  //
  // Requires JWT.
  // ==========================================================

  delete: async (
    id: string
  ): Promise<void> => {

    try {

      if (!id) {
        throw new Error(
          'Answer key ID is required.'
        )
      }

      await axios.delete(
        `${API_URL}/answer-key/${encodeURIComponent(id)}`,
        getAuthConfig()
      )

    } catch (error: any) {

      console.error(
        '❌ Delete answer key error:',
        error.response?.data ||
        error.message
      )

      throw error
    }
  },


  // ==========================================================
  // PUBLIC LIST
  // ==========================================================

  listPublic: async (): Promise<AnswerKeyListItem[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/answer-key/public-list`,
        getPublicConfig()
      )
      return response.data.data || []
    } catch (error: any) {
      console.error(
        '❌ Public list answer keys error:',
        error.response?.data || error.message
      )
      throw error
    }
  },


  // ==========================================================
  // PUBLIC GET BY ID
  // ==========================================================

  getPublicById: async (id: string): Promise<AnswerKey> => {
    try {
      if (!id) {
        throw new Error('Answer key ID is required.')
      }

      const response = await axios.get(
        `${API_URL}/answer-key/public/${encodeURIComponent(id)}`,
        getPublicConfig()
      )

      return response.data.data
    } catch (error: any) {
      console.error(
        '❌ Public get answer key error:',
        error.response?.data || error.message
      )
      throw error
    }
  },


  // ==========================================================
  // PUBLIC UPDATE
  // ==========================================================

  updatePublic: async (
    id: string,
    data: Partial<AnswerKeyCreateData>
  ): Promise<AnswerKey> => {
    try {
      if (!id) {
        throw new Error('Answer key ID is required.')
      }

      const payload = normalizeCreatePayload(
        data as AnswerKeyCreateData
      )

      const response = await axios.put(
        `${API_URL}/answer-key/public/${encodeURIComponent(id)}`,
        payload,
        getPublicConfig()
      )

      return response.data.data
    } catch (error: any) {
      console.error(
        '❌ Public update answer key error:',
        error.response?.data || error.message
      )
      throw error
    }
  },


  // ==========================================================
  // PUBLIC DELETE
  // ==========================================================

  deletePublic: async (id: string): Promise<void> => {
    try {
      if (!id) {
        throw new Error('Answer key ID is required.')
      }

      await axios.delete(
        `${API_URL}/answer-key/public/${encodeURIComponent(id)}`,
        getPublicConfig()
      )
    } catch (error: any) {
      console.error(
        '❌ Public delete answer key error:',
        error.response?.data || error.message
      )
      throw error
    }
  },


  // ==========================================================
  // AUTHENTICATED GET BY SUBJECT
  // ==========================================================
  //
  // GET:
  // /api/answer-key/subject/<subject>
  //
  // Requires JWT.
  // ==========================================================

  getBySubject: async (
    subject: string
  ): Promise<AnswerKeyListItem[]> => {

    try {

      if (!subject) {
        throw new Error(
          'Subject is required.'
        )
      }

      const response =
        await axios.get(
          `${API_URL}/answer-key/subject/${encodeURIComponent(subject)}`,
          getAuthConfig()
        )

      return response.data.data

    } catch (error: any) {

      console.error(
        '❌ Get answer keys by subject error:',
        error.response?.data ||
        error.message
      )

      throw error
    }
  },


  // ==========================================================
  // DOWNLOAD ANSWER KEY AS JSON
  // ==========================================================
  //
  // This does NOT call the backend.
  //
  // It directly converts the AnswerKey object into JSON
  // and downloads it in the browser.
  // ==========================================================

  downloadJSON: (
    answerKey: AnswerKey
  ): void => {

    try {

      if (!answerKey) {
        throw new Error(
          'Answer key data is required.'
        )
      }


      // ------------------------------------------------------
      // Normalize before downloading
      // ------------------------------------------------------

      const normalized =
        normalizeCreatePayload(
          answerKey as AnswerKeyCreateData
        )


      // ------------------------------------------------------
      // JSON DATA
      // ------------------------------------------------------

      const jsonData = {

        id:
          answerKey.id,

        name:
          answerKey.name,

        subject:
          answerKey.subject,

        subject_code:
          answerKey.subject_code,

        college_name:
          answerKey.college_name,

        department:
          answerKey.department,

        semester:
          answerKey.semester,

        examination_type:
          answerKey.examination_type,

        academic_year:
          answerKey.academic_year,

        examination_date:
          answerKey.examination_date,

        total_marks:
          answerKey.total_marks,

        duration:
          answerKey.duration,

        total_questions:
          normalized.total_questions ??
          answerKey.total_questions,

        // New section-based structure
        sections:
          normalized.sections ??
          answerKey.sections ??
          [],

        // Backward-compatible flat structure
        questions:
          normalized.questions ??
          answerKey.questions ??
          [],

        created_at:
          answerKey.created_at,

        updated_at:
          answerKey.updated_at,

        created_by:
          answerKey.created_by,

        creation_mode:
          answerKey.creation_mode,
      }


      // ------------------------------------------------------
      // CONVERT TO JSON
      // ------------------------------------------------------

      const jsonString =
        JSON.stringify(
          jsonData,
          null,
          2
        )


      // ------------------------------------------------------
      // CREATE BLOB
      // ------------------------------------------------------

      const blob =
        new Blob(
          [jsonString],
          {
            type:
              'application/json;charset=utf-8',
          }
        )


      // ------------------------------------------------------
      // CREATE TEMPORARY URL
      // ------------------------------------------------------

      const url =
        URL.createObjectURL(
          blob
        )


      // ------------------------------------------------------
      // SAFE FILE NAME
      // ------------------------------------------------------

      const safeName =
        (
          answerKey.name ||
          'answer-key'
        )
          .trim()
          .replace(
            /[^a-zA-Z0-9-_ ]/g,
            ''
          )
          .replace(
            /\s+/g,
            '_'
          )


      const filename =
        `${safeName || 'answer-key'}.json`


      // ------------------------------------------------------
      // DOWNLOAD
      // ------------------------------------------------------

      const link =
        document.createElement(
          'a'
        )

      link.href =
        url

      link.download =
        filename

      document.body.appendChild(
        link
      )

      link.click()

      document.body.removeChild(
        link
      )


      // ------------------------------------------------------
      // CLEANUP
      // ------------------------------------------------------

      URL.revokeObjectURL(
        url
      )


      console.log(
        `✅ Answer key JSON downloaded: ${filename}`
      )

    } catch (error) {

      console.error(
        '❌ Failed to download answer key JSON:',
        error
      )

      throw new Error(
        'Failed to download answer key JSON'
      )
    }
  },


  // ==========================================================
  // DOWNLOAD JSON BY ID
  // ==========================================================
  //
  // IMPORTANT:
  // This operation uses getById(), which is AUTHENTICATED.
  //
  // Therefore it should be used from the logged-in
  // Answer Key List, not the public creation page.
  // ==========================================================

  downloadJSONById: async (
    id: string
  ): Promise<void> => {

    try {

      if (!id) {
        throw new Error(
          'Answer key ID is required.'
        )
      }

      const answerKey =
        await answerKeyService.getById(
          id
        )

      answerKeyService.downloadJSON(
        answerKey
      )

    } catch (error: any) {

      console.error(
        '❌ Download answer key error:',
        error.response?.data ||
        error.message
      )

      throw error
    }
  },

}


// ============================================================
// OPTIONAL EXPORTS
// ============================================================
//
// These are exported so other frontend modules can reuse the
// exact same MCQ normalization rules if needed.
// ============================================================

export {
  normalizeAnswer,
  canonicalizeMCQAnswer,
  buildAcceptedAnswers,
  normalizeQuestion,
  normalizeSection,
  normalizeCreatePayload,
}
