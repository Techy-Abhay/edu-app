import { Question, Session, Response, User, Topic } from '../types';

// Mock Users
export const mockUsers: User[] = [
  { userId: 'U001', name: 'Abhay', role: 'Parent' },
  { userId: 'U002', name: 'Son', role: 'Student' },
];

// Mock Topics
export const mockTopics: Topic[] = [
  // English - Class 6
  { topicId: 'T001', class: 6, subject: 'English', topicName: 'Nouns', description: 'Types of nouns and usage' },
  { topicId: 'T002', class: 6, subject: 'English', topicName: 'Verbs', description: 'Action words and tenses' },
  { topicId: 'T003', class: 6, subject: 'English', topicName: 'Adjectives', description: 'Describing words' },
  { topicId: 'T004', class: 6, subject: 'English', topicName: 'Tenses', description: 'Past, present, and future tenses' },
  
  // Mathematics - Class 6
  { topicId: 'T005', class: 6, subject: 'Mathematics', topicName: 'Fractions', description: 'Understanding and operations with fractions' },
  { topicId: 'T006', class: 6, subject: 'Mathematics', topicName: 'Algebra', description: 'Basic algebraic expressions' },
  { topicId: 'T007', class: 6, subject: 'Mathematics', topicName: 'Geometry', description: 'Shapes, angles, and measurements' },
  { topicId: 'T008', class: 6, subject: 'Mathematics', topicName: 'Numbers', description: 'Number systems and operations' },
  
  // Science - Class 6
  { topicId: 'T009', class: 6, subject: 'Science', topicName: 'Plants', description: 'Plant parts and photosynthesis' },
  { topicId: 'T010', class: 6, subject: 'Science', topicName: 'Animals', description: 'Animal classification and habitats' },
  { topicId: 'T011', class: 6, subject: 'Science', topicName: 'Physics', description: 'Basic physics concepts' },
  { topicId: 'T012', class: 6, subject: 'Science', topicName: 'Chemistry', description: 'Matter and changes' },
  
  // GK - Class 6
  { topicId: 'T013', class: 6, subject: 'GK', topicName: 'Geography', description: 'World geography and capitals' },
  { topicId: 'T014', class: 6, subject: 'GK', topicName: 'History', description: 'Indian and world history' },
  { topicId: 'T015', class: 6, subject: 'GK', topicName: 'Current Affairs', description: 'Recent events and news' },
  
  // Sports - Class 6
  { topicId: 'T016', class: 6, subject: 'Sports', topicName: 'Cricket', description: 'Cricket rules and players' },
  { topicId: 'T017', class: 6, subject: 'Sports', topicName: 'Football', description: 'Football rules and tournaments' },
  { topicId: 'T018', class: 6, subject: 'Sports', topicName: 'Olympics', description: 'Olympic sports and history' },
];

// Mock Questions - Class 6 Level
export const mockQuestions: Question[] = [
  // English Questions - Class 6
  {
    questionId: 'ENG001',
    class: 6,
    subject: 'English',
    topic: 'Nouns',
    question: 'Which word is a noun?',
    optionA: 'Quickly',
    optionB: 'School',
    optionC: 'Beautiful',
    optionD: 'Run',
    correctAnswer: 'B',
    explanation: '"School" is a noun because it names a place.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'ENG002',
    class: 6,
    subject: 'English',
    topic: 'Verbs',
    question: 'Identify the verb in this sentence: "The cat jumps over the fence."',
    optionA: 'Cat',
    optionB: 'Jumps',
    optionC: 'Fence',
    optionD: 'Over',
    correctAnswer: 'B',
    explanation: '"Jumps" is a verb showing the action performed by the cat.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'ENG003',
    class: 6,
    subject: 'English',
    topic: 'Adjectives',
    question: 'Which word describes the noun in: "The beautiful garden has many flowers"?',
    optionA: 'Garden',
    optionB: 'Has',
    optionC: 'Beautiful',
    optionD: 'Many',
    correctAnswer: 'C',
    explanation: '"Beautiful" is an adjective that describes the garden.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'ENG004',
    class: 6,
    subject: 'English',
    topic: 'Tenses',
    question: 'Which sentence is in the past tense?',
    optionA: 'I am reading a book.',
    optionB: 'I read a book yesterday.',
    optionC: 'I will read a book.',
    optionD: 'I am going to read.',
    correctAnswer: 'B',
    explanation: 'The word "yesterday" indicates past tense, and "read" is the past form.',
    difficulty: 'Medium',
    active: true,
  },
  {
    questionId: 'ENG005',
    class: 6,
    subject: 'English',
    topic: 'Tenses',
    question: 'Which sentence is in present continuous tense?',
    optionA: 'She plays tennis.',
    optionB: 'She played tennis.',
    optionC: 'She is playing tennis.',
    optionD: 'She will play tennis.',
    correctAnswer: 'C',
    explanation: 'Present continuous uses "is/am/are + verb-ing" to show ongoing action.',
    difficulty: 'Medium',
    active: true,
  },
  
  // Mathematics Questions - Class 6 (simple text with Unicode symbols)
  {
    questionId: 'MAT001',
    class: 6,
    subject: 'Mathematics',
    topic: 'Fractions',
    question: 'What is 1/2 + 1/4?',
    optionA: '2/6',
    optionB: '3/4',
    optionC: '1/6',
    optionD: '2/4',
    correctAnswer: 'B',
    explanation: '1/2 = 2/4, so 2/4 + 1/4 = 3/4',
    difficulty: 'Medium',
    active: true,
  },
  {
    questionId: 'MAT002',
    class: 6,
    subject: 'Mathematics',
    topic: 'Numbers',
    question: 'What is 15 × 12?',
    optionA: '150',
    optionB: '180',
    optionC: '170',
    optionD: '160',
    correctAnswer: 'B',
    explanation: '15 × 12 = (15 × 10) + (15 × 2) = 150 + 30 = 180',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'MAT003',
    class: 6,
    subject: 'Mathematics',
    topic: 'Geometry',
    question: 'How many sides does a hexagon have?',
    optionA: '5',
    optionB: '6',
    optionC: '7',
    optionD: '8',
    correctAnswer: 'B',
    explanation: 'A hexagon has 6 sides. "Hexa" means six.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'MAT004',
    class: 6,
    subject: 'Mathematics',
    topic: 'Algebra',
    question: 'If x + 5 = 12, what is the value of x?',
    optionA: '5',
    optionB: '6',
    optionC: '7',
    optionD: '8',
    correctAnswer: 'C',
    explanation: 'x = 12 - 5 = 7',
    difficulty: 'Medium',
    active: true,
  },
  {
    questionId: 'MAT005',
    class: 6,
    subject: 'Mathematics',
    topic: 'Numbers',
    question: 'What is the next prime number after 7?',
    optionA: '8',
    optionB: '9',
    optionC: '10',
    optionD: '11',
    correctAnswer: 'D',
    explanation: '11 is the next prime number. 8, 9, and 10 are composite numbers.',
    difficulty: 'Medium',
    active: true,
  },
  
  // Science Questions - Class 6
  {
    questionId: 'SCI001',
    class: 6,
    subject: 'Science',
    topic: 'Plants',
    question: 'What is the process by which plants make their food?',
    optionA: 'Respiration',
    optionB: 'Photosynthesis',
    optionC: 'Digestion',
    optionD: 'Reproduction',
    correctAnswer: 'B',
    explanation: 'Photosynthesis is the process where plants use sunlight, water, and CO2 to make food.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'SCI002',
    class: 6,
    subject: 'Science',
    topic: 'Animals',
    question: 'Which of these is a mammal?',
    optionA: 'Sparrow',
    optionB: 'Shark',
    optionC: 'Dolphin',
    optionD: 'Crocodile',
    correctAnswer: 'C',
    explanation: 'Dolphins are mammals that live in water. They give birth to live young and feed them milk.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'SCI003',
    class: 6,
    subject: 'Science',
    topic: 'Physics',
    question: 'What is the basic unit of energy?',
    optionA: 'Watt',
    optionB: 'Joule',
    optionC: 'Newton',
    optionD: 'Volt',
    correctAnswer: 'B',
    explanation: 'Joule (J) is the SI unit of energy.',
    difficulty: 'Medium',
    active: true,
  },
  {
    questionId: 'SCI004',
    class: 6,
    subject: 'Science',
    topic: 'Chemistry',
    question: 'What are the three states of matter?',
    optionA: 'Solid, Liquid, Air',
    optionB: 'Solid, Liquid, Gas',
    optionC: 'Ice, Water, Steam',
    optionD: 'Hard, Soft, Gas',
    correctAnswer: 'B',
    explanation: 'The three states of matter are solid, liquid, and gas.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'SCI005',
    class: 6,
    subject: 'Science',
    topic: 'Plants',
    question: 'Which part of the plant absorbs water from the soil?',
    optionA: 'Leaves',
    optionB: 'Stem',
    optionC: 'Roots',
    optionD: 'Flowers',
    correctAnswer: 'C',
    explanation: 'Roots absorb water and minerals from the soil.',
    difficulty: 'Easy',
    active: true,
  },
  
  // GK Questions - Class 6
  {
    questionId: 'GK001',
    class: 6,
    subject: 'GK',
    topic: 'Geography',
    question: 'What is the capital of India?',
    optionA: 'Mumbai',
    optionB: 'New Delhi',
    optionC: 'Kolkata',
    optionD: 'Chennai',
    correctAnswer: 'B',
    explanation: 'New Delhi is the capital of India.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'GK002',
    class: 6,
    subject: 'GK',
    topic: 'Geography',
    question: 'Which is the largest continent in the world?',
    optionA: 'Africa',
    optionB: 'Europe',
    optionC: 'Asia',
    optionD: 'North America',
    correctAnswer: 'C',
    explanation: 'Asia is the largest continent by both area and population.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'GK003',
    class: 6,
    subject: 'GK',
    topic: 'History',
    question: 'Who is known as the Father of the Nation in India?',
    optionA: 'Jawaharlal Nehru',
    optionB: 'Mahatma Gandhi',
    optionC: 'Subhas Chandra Bose',
    optionD: 'Sardar Patel',
    correctAnswer: 'B',
    explanation: 'Mahatma Gandhi is called the Father of the Nation.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'GK004',
    class: 6,
    subject: 'GK',
    topic: 'Current Affairs',
    question: 'What is the national bird of India?',
    optionA: 'Parrot',
    optionB: 'Peacock',
    optionC: 'Eagle',
    optionD: 'Sparrow',
    correctAnswer: 'B',
    explanation: 'The Indian Peacock is the national bird of India.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'GK005',
    class: 6,
    subject: 'GK',
    topic: 'Geography',
    question: 'How many states are there in India?',
    optionA: '28',
    optionB: '29',
    optionC: '30',
    optionD: '27',
    correctAnswer: 'A',
    explanation: 'India has 28 states and 8 union territories.',
    difficulty: 'Medium',
    active: true,
  },
  
  // Sports Questions - Class 6
  {
    questionId: 'SPT001',
    class: 6,
    subject: 'Sports',
    topic: 'Cricket',
    question: 'How many players are there in a cricket team?',
    optionA: '10',
    optionB: '11',
    optionC: '12',
    optionD: '9',
    correctAnswer: 'B',
    explanation: 'A cricket team has 11 players.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'SPT002',
    class: 6,
    subject: 'Sports',
    topic: 'Football',
    question: 'Which country won the FIFA World Cup in 2018?',
    optionA: 'Brazil',
    optionB: 'Germany',
    optionC: 'France',
    optionD: 'Argentina',
    correctAnswer: 'C',
    explanation: 'France won the FIFA World Cup in 2018.',
    difficulty: 'Medium',
    active: true,
  },
  {
    questionId: 'SPT003',
    class: 6,
    subject: 'Sports',
    topic: 'Olympics',
    question: 'How often are the Olympic Games held?',
    optionA: 'Every 2 years',
    optionB: 'Every 3 years',
    optionC: 'Every 4 years',
    optionD: 'Every 5 years',
    correctAnswer: 'C',
    explanation: 'The Olympic Games are held every 4 years.',
    difficulty: 'Easy',
    active: true,
  },
  {
    questionId: 'SPT004',
    class: 6,
    subject: 'Sports',
    topic: 'Cricket',
    question: 'What is the maximum number of overs in a One Day International (ODI) cricket match per team?',
    optionA: '40',
    optionB: '45',
    optionC: '50',
    optionD: '60',
    correctAnswer: 'C',
    explanation: 'Each team plays 50 overs in an ODI cricket match.',
    difficulty: 'Medium',
    active: true,
  },
  {
    questionId: 'SPT005',
    class: 6,
    subject: 'Sports',
    topic: 'Olympics',
    question: 'In which city were the first modern Olympic Games held?',
    optionA: 'Paris',
    optionB: 'Athens',
    optionC: 'London',
    optionD: 'Rome',
    correctAnswer: 'B',
    explanation: 'The first modern Olympic Games were held in Athens, Greece in 1896.',
    difficulty: 'Hard',
    active: true,
  },
];

// Add more questions to reach 100 total (adding abbreviated versions for brevity)
// In production, you would have all 100 questions fully detailed

// Mock Sessions
export const mockSessions: Session[] = [
  {
    sessionId: 'ENG-20260820-1830-001',
    userId: 'U002',
    class: 6,
    subject: 'English',
    topic: 'Tenses',
    mode: 'Topic Practice',
    startTime: '2026-08-20T18:30:00',
    endTime: '2026-08-20T18:47:00',
    totalQuestions: 20,
    correctAnswers: 16,
    score: 80,
    duration: 1020,
    timestamp: '2026-08-20T18:30:00',
    synced: true,
  },
  {
    sessionId: 'MAT-20260821-1500-001',
    userId: 'U002',
    class: 6,
    subject: 'Mathematics',
    topic: 'Fractions',
    mode: 'Topic Practice',
    startTime: '2026-08-21T15:00:00',
    endTime: '2026-08-21T15:25:00',
    totalQuestions: 15,
    correctAnswers: 11,
    score: 73,
    duration: 1500,
    timestamp: '2026-08-21T15:00:00',
    synced: true,
  },
  {
    sessionId: 'SCI-20260822-1630-001',
    userId: 'U002',
    class: 6,
    subject: 'Science',
    topic: null,
    mode: 'Practice',
    startTime: '2026-08-22T16:30:00',
    endTime: '2026-08-22T16:52:00',
    totalQuestions: 25,
    correctAnswers: 23,
    score: 92,
    duration: 1320,
    timestamp: '2026-08-22T16:30:00',
    synced: true,
  },
  {
    sessionId: 'GK-20260823-1400-001',
    userId: 'U002',
    class: 6,
    subject: 'GK',
    topic: 'Geography',
    mode: 'Topic Practice',
    startTime: '2026-08-23T14:00:00',
    endTime: '2026-08-23T14:18:00',
    totalQuestions: 20,
    correctAnswers: 14,
    score: 70,
    duration: 1080,
    timestamp: '2026-08-23T14:00:00',
    synced: true,
  },
  {
    sessionId: 'SPT-20260824-1000-001',
    userId: 'U002',
    class: 6,
    subject: 'Sports',
    topic: 'Cricket',
    mode: 'Topic Practice',
    startTime: '2026-08-24T10:00:00',
    endTime: '2026-08-24T10:15:00',
    totalQuestions: 10,
    correctAnswers: 9,
    score: 90,
    duration: 900,
    timestamp: '2026-08-24T10:00:00',
    synced: true,
  },
];

// Mock Responses
export const mockResponses: Response[] = [
  // ENG-20260820-1830-001 responses
  {
    responseId: 'R001',
    sessionId: 'ENG-20260820-1830-001',
    questionId: 'ENG004',
    selectedAnswer: 'B',
    correct: true,
    responseTime: 8,
    timestamp: '2026-08-20T18:31:00',
  },
  {
    responseId: 'R002',
    sessionId: 'ENG-20260820-1830-001',
    questionId: 'ENG005',
    selectedAnswer: 'C',
    correct: true,
    responseTime: 12,
    timestamp: '2026-08-20T18:32:00',
  },
  // Add more responses...
];

// Helper function to get questions by subject
export const getQuestionsBySubject = (subject: string, classLevel?: number): Question[] => {
  return mockQuestions.filter(q => 
    q.subject === subject && 
    q.active &&
    (classLevel === undefined || q.class === classLevel)
  );
};

// Helper function to get questions by topic
export const getQuestionsByTopic = (subject: string, topic: string, classLevel?: number): Question[] => {
  return mockQuestions.filter(
    q => q.subject === subject && 
    q.topic === topic && 
    q.active &&
    (classLevel === undefined || q.class === classLevel)
  );
};

// Helper function to get questions by class
export const getQuestionsByClass = (classLevel: number): Question[] => {
  return mockQuestions.filter(q => q.class === classLevel && q.active);
};

// Helper function to get topics by subject
export const getTopicsBySubject = (subject: string, classLevel?: number): Topic[] => {
  return mockTopics.filter(t => 
    t.subject === subject &&
    (classLevel === undefined || t.class === classLevel)
  );
};

// Get available subjects
export const getAvailableSubjects = (classLevel?: number): string[] => {
  const questions = classLevel !== undefined 
    ? mockQuestions.filter(q => q.class === classLevel)
    : mockQuestions;
  return Array.from(new Set(questions.map(q => q.subject)));
};
