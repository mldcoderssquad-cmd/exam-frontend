// src/services/api/transformers.ts

import { StudentResult, QuestionDetail, VerifiedDetail } from './examService';
import { AnswerSheetOCR, QuestionMark } from '@/types';

/**
 * Transform API StudentResult to frontend AnswerSheetOCR format
 */
export const transformStudentToSheet = (
  result: StudentResult
): AnswerSheetOCR => {
  // Calculate overall confidence based on verification confidence
  const avgConfidence = result.verified.reduce(
    (acc, v) => acc + v.confidence,
    0
  ) / (result.verified.length || 1);

  const overallConfidence =
    avgConfidence >= 0.8 ? 'High' :
    avgConfidence >= 0.5 ? 'Medium' : 'Low';

  // Build field confidences
  const fieldConfidences: Record<string, 'High' | 'Medium' | 'Low'> = {};
  result.verified.forEach((v) => {
    fieldConfidences[v.question_number] =
      v.confidence >= 0.8 ? 'High' :
      v.confidence >= 0.5 ? 'Medium' : 'Low';
  });

  // Get first question for demo fields (frontend expects these)
  const firstQuestion = result.questions[0] || {};

  return {
    id: `sheet_${result.roll}`,
    filename: result.filename,
    studentName: result.student_name,
    rollNumber: result.roll,
    cuid: `CU${result.roll}`,
    program: 'B.Tech',
    branch: 'Computer Science',
    courseName: 'Machine Learning',
    courseCode: 'ML101',
    fatherName: '',
    overallConfidence,
    fieldConfidences,
    verificationStatus: 'pending',
    mappingStatus: 'Mapped',
    mappedStudentId: result.roll,
  };
};

/**
 * Transform API results to frontend questions format
 */
export const transformToQuestions = (
  questions: QuestionDetail[],
  verified: VerifiedDetail[]
): QuestionMark[] => {
  return questions.map((q, index) => {
    const v = verified.find((v) => v.question_number === q.question_number);
    return {
      id: `q_${index + 1}`,
      number: parseInt(q.question_number.replace(/\D/g, '')) || index + 1,
      text: q.question_text || `Question ${index + 1}`,
      answer: q.model_answer || '',
      maxMarks: q.max_marks || 10,
      marksAwarded: v?.verified_marks || 0,
      feedback: v?.reason || '',
      isAttempted: q.is_attempted || false,
      confidence: v?.confidence || 0,
      hasDiagram: q.diagram_expected || false,
      diagramDescription: q.diagram_description || '',
    };
  });
};