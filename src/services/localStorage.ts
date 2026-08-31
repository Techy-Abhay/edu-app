/**
 * Local Storage Service using IndexedDB
 * Stores questions, topics, sessions, and responses locally
 * Provides sync mechanisms with the server
 */

import { Question, Topic, Session, Response } from '../types';

const DB_NAME = 'EduAppDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  QUESTIONS: 'questions',
  TOPICS: 'topics',
  SESSIONS: 'sessions',
  RESPONSES: 'responses',
  METADATA: 'metadata'
};

interface Metadata {
  key: string;
  value: any;
  timestamp: number;
}

/**
 * Initialize IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.QUESTIONS)) {
        const questionStore = db.createObjectStore(STORES.QUESTIONS, { keyPath: 'questionId' });
        questionStore.createIndex('subject', 'subject', { unique: false });
        questionStore.createIndex('topic', 'topic', { unique: false });
        questionStore.createIndex('class', 'class', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.TOPICS)) {
        const topicStore = db.createObjectStore(STORES.TOPICS, { keyPath: 'topicId' });
        topicStore.createIndex('subject', 'subject', { unique: false });
        topicStore.createIndex('class', 'class', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
        const sessionStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'sessionId' });
        sessionStore.createIndex('class', 'class', { unique: false });
        sessionStore.createIndex('subject', 'subject', { unique: false });
        sessionStore.createIndex('timestamp', 'timestamp', { unique: false });
        sessionStore.createIndex('synced', 'synced', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.RESPONSES)) {
        const responseStore = db.createObjectStore(STORES.RESPONSES, { keyPath: 'responseId' });
        responseStore.createIndex('sessionId', 'sessionId', { unique: false });
        responseStore.createIndex('questionId', 'questionId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.METADATA)) {
        db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Generic function to add/update data in a store
 */
async function putData<T>(storeName: string, data: T | T[]): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  const items = Array.isArray(data) ? data : [data];
  
  for (const item of items) {
    store.put(item);
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Generic function to get all data from a store
 */
async function getAllData<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic function to get data by index
 */
async function getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const index = store.index(indexName);
  const request = index.getAll(value);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic function to clear a store
 */
async function clearStore(storeName: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  store.clear();

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Save metadata (like last sync time)
 */
export async function saveMetadata(key: string, value: any): Promise<void> {
  const metadata: Metadata = {
    key,
    value,
    timestamp: Date.now()
  };
  await putData(STORES.METADATA, metadata);
}

/**
 * Get metadata value
 */
export async function getMetadata(key: string): Promise<any> {
  const db = await openDB();
  const transaction = db.transaction(STORES.METADATA, 'readonly');
  const store = transaction.objectStore(STORES.METADATA);
  const request = store.get(key);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error);
  });
}

// ========== QUESTIONS ==========

export async function saveQuestions(questions: Question[]): Promise<void> {
  await putData(STORES.QUESTIONS, questions);
  await saveMetadata('questionsLastSync', Date.now());
  console.log(`💾 Saved ${questions.length} questions to local storage`);
}

export async function getQuestions(subject?: string, topic?: string, classLevel?: number): Promise<Question[]> {
  let questions = await getAllData<Question>(STORES.QUESTIONS);
  
  if (subject) {
    questions = questions.filter(q => q.subject === subject);
  }
  if (topic) {
    questions = questions.filter(q => q.topic === topic);
  }
  if (classLevel) {
    questions = questions.filter(q => q.class === classLevel);
  }
  
  return questions;
}

export async function clearQuestions(): Promise<void> {
  await clearStore(STORES.QUESTIONS);
  await saveMetadata('questionsLastSync', null);
}

// ========== TOPICS ==========

export async function saveTopics(topics: Topic[]): Promise<void> {
  await putData(STORES.TOPICS, topics);
  await saveMetadata('topicsLastSync', Date.now());
  console.log(`💾 Saved ${topics.length} topics to local storage`);
}

export async function getTopics(subject?: string, classLevel?: number): Promise<Topic[]> {
  let topics = await getAllData<Topic>(STORES.TOPICS);
  
  if (subject) {
    topics = topics.filter(t => t.subject === subject);
  }
  if (classLevel) {
    topics = topics.filter(t => t.class === classLevel);
  }
  
  return topics;
}

export async function clearTopics(): Promise<void> {
  await clearStore(STORES.TOPICS);
  await saveMetadata('topicsLastSync', null);
}

// ========== SESSIONS ==========

export async function saveSession(session: Session): Promise<void> {
  await putData(STORES.SESSIONS, session);
  console.log(`💾 Saved session ${session.sessionId} to local storage`);
}

/**
 * Save session details for review (questions, answers, options)
 */
export async function saveSessionDetails(sessionId: string, details: {
  questions: any[];
  answers: Record<string, string>;
  shuffledOptionsMap: Record<string, any>;
}): Promise<void> {
  await saveMetadata(`session-details-${sessionId}`, details);
  console.log(`💾 Saved details for session ${sessionId}`);
}

/**
 * Get session details for review
 */
export async function getSessionDetails(sessionId: string): Promise<{
  questions: any[];
  answers: Record<string, string>;
  shuffledOptionsMap: Record<string, any>;
} | null> {
  const details = await getMetadata(`session-details-${sessionId}`);
  return details || null;
}

export async function getSessions(classLevel?: number, subject?: string): Promise<Session[]> {
  let sessions = await getAllData<Session>(STORES.SESSIONS);
  
  if (classLevel) {
    sessions = sessions.filter(s => s.class === classLevel);
  }
  if (subject) {
    sessions = sessions.filter(s => s.subject === subject);
  }
  
  // Sort by timestamp descending (newest first)
  return sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getSessionById(sessionId: string): Promise<Session | undefined> {
  const db = await openDB();
  const transaction = db.transaction(STORES.SESSIONS, 'readonly');
  const store = transaction.objectStore(STORES.SESSIONS);
  const request = store.get(sessionId);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getUnsyncedSessions(): Promise<Session[]> {
  return await getByIndex<Session>(STORES.SESSIONS, 'synced', false);
}

export async function markSessionSynced(sessionId: string): Promise<void> {
  const session = await getSessionById(sessionId);
  if (session) {
    session.synced = true;
    await putData(STORES.SESSIONS, session);
  }
}

// ========== RESPONSES ==========

export async function saveResponses(responses: Response[]): Promise<void> {
  await putData(STORES.RESPONSES, responses);
  console.log(`💾 Saved ${responses.length} responses to local storage`);
}

export async function getResponsesBySession(sessionId: string): Promise<Response[]> {
  return await getByIndex<Response>(STORES.RESPONSES, 'sessionId', sessionId);
}

// ========== SYNC MANAGEMENT ==========

/**
 * Check if data needs to be refreshed from server
 * Returns true if last sync was more than 24 hours ago
 */
export async function needsSync(type: 'questions' | 'topics'): Promise<boolean> {
  const lastSync = await getMetadata(`${type}LastSync`);
  if (!lastSync) return true;
  
  const hoursSinceSync = (Date.now() - lastSync) / (1000 * 60 * 60);
  return hoursSinceSync > 24; // Sync if more than 24 hours old
}

/**
 * Get last sync timestamp
 */
export async function getLastSyncTime(type: 'questions' | 'topics'): Promise<Date | null> {
  const timestamp = await getMetadata(`${type}LastSync`);
  return timestamp ? new Date(timestamp) : null;
}

/**
 * Clear all data (useful for debugging or logout)
 */
export async function clearAllData(): Promise<void> {
  await clearQuestions();
  await clearTopics();
  await clearStore(STORES.SESSIONS);
  await clearStore(STORES.RESPONSES);
  await clearStore(STORES.METADATA);
  console.log('🗑️ Cleared all local data');
}
