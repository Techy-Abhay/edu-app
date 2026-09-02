/**
 * App Configuration Settings
 */

export const APP_CONFIG = {
  // Practice settings
  DEFAULT_PRACTICE_QUESTIONS: 20,
  DEFAULT_TOPIC_QUESTIONS: 15,
  DEFAULT_MOCK_TEST_QUESTIONS: 25,
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 50,
  
  // Subjects
  SUBJECTS: ['English', 'Mathematics', 'Science', 'GK', 'Sports'],
  
  // Subject icons
  SUBJECT_ICONS: {
    'English': '📖',
    'Mathematics': '🔢',
    'Science': '🔬',
    'GK': '🌎',
    'Sports': '⚽',
  } as { [key: string]: string },
  
  // Cache settings
  CACHE_DURATION_HOURS: 24,
  
  // Session settings
  TRACK_QUICK_PRACTICE: true,
  TRACK_RANDOM_PRACTICE: true,
};

export default APP_CONFIG;
