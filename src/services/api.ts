import { API_BASE_URL } from '../config';
import { Question, Topic, Session } from '../types';

/**
 * API Service for Google Apps Script Backend
 * Handles all communication with the Google Sheets backend
 */

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

/**
 * Make API request to Google Apps Script with timeout
 * Extended timeout to 60 seconds for Google's cloud infrastructure
 */
async function makeRequest<T>(params: Record<string, string>, timeoutMs = 60000): Promise<T> {
  const url = new URL(API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  console.log('🔗 API Request:', url.toString());

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startTime = Date.now();
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      mode: 'cors',
    });
    clearTimeout(timeoutId);
    
    const duration = Date.now() - startTime;
    console.log(`✅ API Response received in ${duration}ms:`, response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    console.log('📄 Response text:', text.substring(0, 200));
    
    let result: ApiResponse<T>;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', text);
      throw new Error('Invalid JSON response from server');
    }

    if (!result.success) {
      console.error('❌ API Error:', result.error);
      throw new Error(result.error || 'API request failed');
    }

    console.log('✅ API Success:', result.data);
    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('⏱️ Request timeout after', timeoutMs, 'ms');
        throw new Error('Request timeout - please check your connection');
      }
      
      console.error('❌ API Request failed:', error.message);
      
      // Add more helpful error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error - check if Apps Script is deployed with "Anyone" access');
      }
    }
    
    throw error;
  }
}

/**
 * Get questions by subject and optionally by topic
 */
export async function getQuestions(subject: string, topic?: string): Promise<Question[]> {
  const params: Record<string, string> = {
    action: 'getQuestions',
    subject: subject,
  };

  if (topic) {
    params.topic = topic;
  }

  return makeRequest<Question[]>(params);
}

/**
 * Get topics for a subject
 */
export async function getTopics(subject: string): Promise<Topic[]> {
  return makeRequest<Topic[]>({
    action: 'getTopics',
    subject: subject,
  });
}

/**
 * Get list of available subjects
 */
export async function getSubjects(): Promise<Array<{ name: string; questionCount: number }>> {
  return makeRequest<Array<{ name: string; questionCount: number }>>({
    action: 'getSubjects',
  });
}

/**
 * Start a new practice session
 */
export async function startSession(data: {
  userId: string;
  subject: string;
  topic: string | null;
  mode: string;
  classLevel: number;
}): Promise<{ sessionId: string }> {
  const url = API_BASE_URL;
  const params = new URLSearchParams({ action: 'startSession' });

  const response = await fetch(`${url}?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<{ sessionId: string }> = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to start session');
  }

  return result.data;
}

/**
 * Record a single answer
 */
export async function recordAnswer(data: {
  sessionId: string;
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  responseTime: number;
}): Promise<void> {
  const url = API_BASE_URL;
  const params = new URLSearchParams({ action: 'recordAnswer' });

  const response = await fetch(`${url}?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<void> = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to record answer');
  }
}

/**
 * Complete a session and update final statistics
 */
export async function completeSession(data: {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}): Promise<void> {
  const url = API_BASE_URL;
  const params = new URLSearchParams({ action: 'completeSession' });

  const response = await fetch(`${url}?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<void> = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to complete session');
  }
}

/**
 * Get session history for a user
 */
export async function getHistory(userId: string): Promise<Session[]> {
  return makeRequest<Session[]>({
    action: 'getHistory',
    userId: userId,
  });
}

/**
 * Get statistics for a user
 */
export async function getStatistics(userId: string): Promise<{
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  averageScore: number;
  subjectStats: Array<{
    subject: string;
    sessions: number;
    averageScore: number;
  }>;
}> {
  return makeRequest({
    action: 'getStatistics',
    userId: userId,
  });
}
