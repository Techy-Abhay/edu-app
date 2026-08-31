import { Question } from '../types';

/**
 * Shuffle options for a question to prevent answer patterns
 * Returns shuffled options with mapping to preserve correct answer
 */
export interface ShuffledOption {
  label: string;
  text: string;
  originalLabel: string;
}

export function shuffleQuestionOptions(question: Question): {
  shuffledOptions: ShuffledOption[];
  correctLabel: string;
} {
  // Create array of options with their original labels
  const options: ShuffledOption[] = [
    { label: 'A', text: question.optionA, originalLabel: 'A' },
    { label: 'B', text: question.optionB, originalLabel: 'B' },
    { label: 'C', text: question.optionC, originalLabel: 'C' },
    { label: 'D', text: question.optionD, originalLabel: 'D' },
  ];

  // Shuffle the options using Fisher-Yates algorithm
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Reassign labels A, B, C, D to shuffled positions
  const shuffledOptions = shuffled.map((opt, index) => ({
    ...opt,
    label: ['A', 'B', 'C', 'D'][index],
  }));

  // Find which label the correct answer now has
  const correctOption = shuffledOptions.find(
    opt => opt.originalLabel === question.correctAnswer
  );
  const correctLabel = correctOption ? correctOption.label : 'A';

  return { shuffledOptions, correctLabel };
}

/**
 * Shuffle options for multiple questions
 * Stores shuffling in a Map for quick lookup
 */
export function shuffleOptionsForQuestions(questions: Question[]): Map<string, {
  shuffledOptions: ShuffledOption[];
  correctLabel: string;
}> {
  const shuffleMap = new Map();
  
  questions.forEach(question => {
    shuffleMap.set(question.questionId, shuffleQuestionOptions(question));
  });
  
  return shuffleMap;
}
