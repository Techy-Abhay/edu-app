import * as api from './api';
import * as storage from './localStorage';
import { 
  getQuestionsBySubject as getMockQuestionsBySubject,
  getQuestionsByTopic as getMockQuestionsByTopic,
  getTopicsBySubject as getMockTopicsBySubject,
} from '../data/mockData';
import { Question, Topic, Session, ClassLevel } from '../types';

/**
 * Data Service with local storage caching and automatic fallback
 * Priority: LocalStorage (if fresh) -> API -> LocalStorage (if stale) -> MockData
 */

let useApi = true;
let apiFailureCount = 0;
const MAX_API_FAILURES = 2;

/**
 * Get questions by subject with caching and fallback
 * PRIORITY: LocalStorage -> API (only if empty or forced) -> MockData
 */
export async function getQuestions(subject: string, topic?: string, forceRefresh = false): Promise<Question[]> {
  try {
    // ALWAYS try localStorage first (unless force refresh)
    if (!forceRefresh) {
      const cachedQuestions = await storage.getQuestions(subject, topic);
      if (cachedQuestions.length > 0) {
        console.log(`💾 Loaded ${cachedQuestions.length} questions from local storage for ${subject}${topic ? ` - ${topic}` : ''}`);
        return cachedQuestions;
      }
    }
    
    // Fetch from API only if cache is empty or force refresh
    if (useApi) {
      try {
        console.log(`🌐 Fetching from API for ${subject}${topic ? ` - ${topic}` : ''}...`);
        const questions = await api.getQuestions(subject, topic);
        console.log(`✅ Loaded ${questions.length} questions from API`);
        
        // Normalize class field to ClassLevel (Google Sheets might return string)
        const normalizedQuestions = questions.map(q => ({
          ...q,
          class: (typeof q.class === 'string' ? parseInt(q.class) : q.class) as ClassLevel
        })) as Question[];
        
        // Cache the data - but only save all questions if fetching all
        if (!topic) {
          await storage.saveQuestions(normalizedQuestions);
        }
        
        apiFailureCount = 0;
        return normalizedQuestions;
      } catch (error) {
        console.warn('⚠️ API failed:', error);
        apiFailureCount++;
        
        if (apiFailureCount >= MAX_API_FAILURES) {
          console.warn(`❌ API failed ${MAX_API_FAILURES} times, switching to offline mode`);
          useApi = false;
        }
        
        // Try cached data after API failure
        const cachedQuestions = await storage.getQuestions(subject, topic);
        if (cachedQuestions.length > 0) {
          console.log(`📦 Using cached data after API failure: ${cachedQuestions.length} questions`);
          return cachedQuestions;
        }
      }
    }
    
    // Final fallback to mock data
    console.log('📦 Using mock data (final fallback)');
    return topic 
      ? getMockQuestionsByTopic(subject, topic)
      : getMockQuestionsBySubject(subject);
      
  } catch (error) {
    console.error('Error in getQuestions:', error);
    return topic 
      ? getMockQuestionsByTopic(subject, topic)
      : getMockQuestionsBySubject(subject);
  }
}

/**
 * Get topics by subject with caching and fallback
 * PRIORITY: LocalStorage -> API (only if empty or forced) -> MockData
 */
export async function getTopics(subject: string, forceRefresh = false): Promise<Topic[]> {
  try {
    // ALWAYS try localStorage first (unless force refresh)
    if (!forceRefresh) {
      const cachedTopics = await storage.getTopics(subject);
      if (cachedTopics.length > 0) {
        console.log(`💾 Loaded ${cachedTopics.length} topics from local storage for ${subject}`);
        return cachedTopics;
      }
    }
    
    // Fetch from API only if cache is empty or force refresh
    if (useApi) {
      try {
        console.log(`🌐 Fetching topics from API for ${subject}...`);
        const topics = await api.getTopics(subject);
        console.log(`✅ Loaded ${topics.length} topics from API`);
        
        // Normalize class field to ClassLevel
        const normalizedTopics = topics.map(t => ({
          ...t,
          class: (typeof t.class === 'string' ? parseInt(t.class) : t.class) as ClassLevel
        })) as Topic[];
        
        // Cache the data
        await storage.saveTopics(normalizedTopics);
        
        apiFailureCount = 0;
        return normalizedTopics;
      } catch (error) {
        console.warn('⚠️ API failed:', error);
        apiFailureCount++;
        
        if (apiFailureCount >= MAX_API_FAILURES) {
          useApi = false;
        }
        
        // Try cached data after API failure
        const cachedTopics = await storage.getTopics(subject);
        if (cachedTopics.length > 0) {
          console.log(`📦 Using cached topics after API failure: ${cachedTopics.length} topics`);
          return cachedTopics;
        }
      }
    }
    
    // Fallback to mock
    console.log('📦 Using mock data (final fallback)');
    return getMockTopicsBySubject(subject);
    
  } catch (error) {
    console.error('Error in getTopics:', error);
    return getMockTopicsBySubject(subject);
  }
}

/**
 * Get all subjects (uses hardcoded list for performance)
 */
export async function getSubjects(): Promise<Array<{ name: string; questionCount: number }>> {
  // Return hardcoded subjects to avoid API call
  const subjects = ['English', 'Mathematics', 'Science', 'GK', 'Sports'];
  
  // Try to get counts from localStorage
  const counts = await Promise.all(
    subjects.map(async (name) => {
      const questions = await storage.getQuestions(name);
      return { name, questionCount: questions.length || 100 };
    })
  );
  
  return counts;
}

// ========== SESSION MANAGEMENT ==========

/**
 * Save a practice session locally
 */
export async function saveSession(session: Session): Promise<void> {
  await storage.saveSession(session);
}

/**
 * Save session details for review
 */
export async function saveSessionDetails(sessionId: string, details: {
  questions: any[];
  answers: Record<string, string>;
  shuffledOptionsMap: Record<string, any>;
}): Promise<void> {
  await storage.saveSessionDetails(sessionId, details);
}

/**
 * Get session details for review
 */
export async function getSessionDetails(sessionId: string): Promise<any> {
  return await storage.getSessionDetails(sessionId);
}

/**
 * Get sessions from local storage
 */
export async function getSessions(classLevel?: number, subject?: string): Promise<Session[]> {
  return await storage.getSessions(classLevel, subject);
}

/**
 * Get a specific session by ID
 */
export async function getSessionById(sessionId: string): Promise<Session | undefined> {
  return await storage.getSessionById(sessionId);
}

// ========== SYNC MANAGEMENT ==========

/**
 * Force sync all data from server
 */
export async function syncFromServer(): Promise<{ success: boolean; message: string }> {
  try {
    if (!useApi) {
      enableApi(); // Re-enable API for manual sync
    }

    console.log('🔄 Starting manual sync from server...');
    const subjects = ['English', 'Mathematics', 'Science', 'GK', 'Sports'];
    let totalQuestions = 0;
    let totalTopics = 0;

    for (const subject of subjects) {
      try {
        // Force refresh from API
        const questions = await getQuestions(subject, undefined, true);
        totalQuestions += questions.length;

        const topics = await getTopics(subject, true);
        totalTopics += topics.length;
      } catch (error) {
        console.error(`Failed to sync ${subject}:`, error);
      }
    }

    console.log(`✅ Sync complete: ${totalQuestions} questions, ${totalTopics} topics`);

    return {
      success: true,
      message: `Synced ${totalQuestions} questions and ${totalTopics} topics`
    };
  } catch (error) {
    console.error('Sync failed:', error);
    return {
      success: false,
      message: 'Failed to sync with server. Using cached data.'
    };
  }
}

/**
 * Get last sync time for display
 */
export async function getLastSyncInfo(): Promise<{ questions: Date | null; topics: Date | null }> {
  return {
    questions: await storage.getLastSyncTime('questions'),
    topics: await storage.getLastSyncTime('topics')
  };
}

/**
 * Check if currently using API or offline mode
 */
export function isUsingApi(): boolean {
  return useApi;
}

/**
 * Force enable API mode (for retry)
 */
export function enableApi(): void {
  useApi = true;
  apiFailureCount = 0;
}

/**
 * Clear all local data
 */
export async function clearLocalData(): Promise<void> {
  await storage.clearAllData();
}
