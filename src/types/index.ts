// Core data types based on Google Sheets structure
export type ClassLevel = 6 | 7 | 8 | 9 | 10;

export interface Question {
  questionId: string;
  class: ClassLevel;
  subject: string;
  topic: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  source?: string;
  active: boolean;
}

export interface User {
  userId: string;
  name: string;
  role: 'Student' | 'Parent';
}

export interface Session {
  sessionId: string;
  userId: string;
  class: ClassLevel;
  subject: string;
  topic: string | null;
  mode: 'Practice' | 'Topic Practice' | 'Mistake Review' | 'Mock Test';
  startTime: string;
  endTime: string | null;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  duration: number; // in seconds
  timestamp: string; // ISO timestamp for sorting/filtering
  synced: boolean; // Whether synced to server
}

export interface Response {
  responseId: string;
  sessionId: string;
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  correct: boolean;
  responseTime: number; // in seconds
  timestamp: string;
}

export interface Topic {
  topicId: string;
  class: ClassLevel;
  subject: string;
  topicName: string;
  description?: string;
}

export interface SubjectStats {
  subject: string;
  totalSessions: number;
  totalQuestions: number;
  accuracy: number;
  averageScore: number;
  lastPracticed?: string;
}

export interface DashboardStats {
  today: {
    questionsAnswered: number;
    accuracy: number;
    studyTime: number; // in minutes
  };
  week: {
    questionsAnswered: number;
    accuracy: number;
    studyTime: number;
  };
  subjectStats: SubjectStats[];
}

export interface QuestionAttempt {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  lastAttempted: string;
  mastery: 'Weak' | 'Moderate' | 'Strong';
}

export type SessionMode = 'Learning' | 'Test';
export type AnswerFeedback = 'immediate' | 'end';
