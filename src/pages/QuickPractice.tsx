import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as dataService from '../services/dataService';
import { Question, ClassLevel } from '../types';
import MathText from '../components/MathText';
import { shuffleOptionsForQuestions, ShuffledOption } from '../utils/shuffleOptions';
import './Practice.css';

type AnswerOption = 'A' | 'B' | 'C' | 'D';

const QuickPractice = () => {
  const navigate = useNavigate();
  const { class: classParam } = useParams<{ class: string }>();
  const classLevel = Number(classParam) as ClassLevel;
  
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Map<string, { shuffledOptions: ShuffledOption[]; correctLabel: string }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shownQuestions, setShownQuestions] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load all questions on mount
  useEffect(() => {
    const loadAllQuestions = async () => {
      try {
        setLoading(true);
        const allSubjects = ['English', 'Mathematics', 'Science', 'GK', 'Sports'];
        const allQuestionsArrays = await Promise.all(
          allSubjects.map(s => dataService.getQuestions(s))
        );
        const fetchedQuestions = allQuestionsArrays
          .flat()
          .filter(q => q.class === classLevel && q.active);
        
        console.log(`⚡ Quick Practice: Loaded ${fetchedQuestions.length} questions for class ${classLevel}`);
        console.log('Sample question:', fetchedQuestions[0]);
        
        setAllQuestions(fetchedQuestions);
        const shuffled = shuffleArray(fetchedQuestions);
        setQuestions(shuffled);
        setShuffledOptionsMap(shuffleOptionsForQuestions(shuffled));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        console.error('❌ Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllQuestions();
  }, [classLevel]);

  const shuffleArray = (array: Question[]): Question[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const currentQuestion = questions[currentIndex];
  const correctLabel = currentQuestion ? shuffledOptionsMap.get(currentQuestion.questionId)?.correctLabel : null;
  const isCorrect = currentQuestion && correctLabel && selectedAnswer === correctLabel;

  const handleAnswerSelect = (answer: AnswerOption) => {
    if (!showFeedback && currentQuestion && correctLabel) {
      setSelectedAnswer(answer);
      setShowFeedback(true);
      
      // Update counters
      if (answer === correctLabel) {
        setCorrectCount(count => count + 1);
      } else {
        setIncorrectCount(count => count + 1);
      }
    }
  };

  const handleNext = () => {
    // Mark current question as shown
    const newShownQuestions = new Set(shownQuestions);
    newShownQuestions.add(currentQuestion.questionId);
    
    // Check if all questions have been shown
    if (newShownQuestions.size >= allQuestions.length) {
      // Start new session: reset everything
      setQuestions(shuffleArray(allQuestions));
      setShownQuestions(new Set());
      setCurrentIndex(0);
      setCorrectCount(0);
      setIncorrectCount(0);
    } else {
      // Find next unshown question
      setShownQuestions(newShownQuestions);
      let nextIndex = currentIndex + 1;
      while (nextIndex < questions.length && newShownQuestions.has(questions[nextIndex].questionId)) {
        nextIndex++;
      }
      
      // If we've gone through current batch, reshuffle and find unshown
      if (nextIndex >= questions.length) {
        const newQuestions = shuffleArray(allQuestions).filter(q => !newShownQuestions.has(q.questionId));
        setQuestions(newQuestions);
        setCurrentIndex(0);
      } else {
        setCurrentIndex(nextIndex);
      }
    }
    
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (loading) {
    return (
      <div className="practice">
        <div className="container">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="practice">
        <div className="container">
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => navigate(`/class/${classLevel}/dashboard`)} className="btn btn-primary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="practice quick-practice">
      <div className="container">
        <div className="practice-container">
          <div className="practice-header quick-header">
            <div className="quick-title-line">
              <h2>⚡ Quick Practice</h2>
              <div className="quick-stats-inline">
                <span className="stat-inline correct">✓ {correctCount}</span>
                <span className="stat-inline incorrect">✗ {incorrectCount}</span>
                <span className="stat-inline question-num">Q{currentIndex + 1}</span>
              </div>
            </div>
            <button onClick={() => navigate(`/class/${classLevel}/dashboard`)} className="btn btn-secondary btn-sm">
              Exit
            </button>
          </div>

          <div className="question-card">
            <div className="question-header">
              <span className="badge badge-primary">{currentQuestion.subject}</span>
              <span className="badge">{currentQuestion.topic}</span>
              <span className="badge">{currentQuestion.difficulty}</span>
            </div>

            <h3 className="question-text">
              <MathText text={currentQuestion.question} />
            </h3>

            <div className="options">
              {shuffledOptionsMap.get(currentQuestion.questionId)?.shuffledOptions.map(option => {
                const isSelected = selectedAnswer === option.label;
                const isCorrectOption = option.label === correctLabel;
                let className = 'option';

                if (showFeedback && isCorrectOption) {
                  className += ' option-correct';
                } else if (showFeedback && isSelected) {
                  className += ' option-incorrect';
                } else if (isSelected) {
                  className += ' option-selected';
                }

                return (
                  <button
                    key={option.label}
                    className={className}
                    onClick={() => handleAnswerSelect(option.label as AnswerOption)}
                    disabled={showFeedback}
                  >
                    <span className="option-label">{option.label}</span>
                    <span className="option-text">
                      <MathText text={option.text} />
                    </span>
                  </button>
                );
              }) || []}
            </div>

            {showFeedback && (
              <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
                <div className="feedback-header">
                  <span className="feedback-icon">{isCorrect ? '✓' : '✗'}</span>
                  <span className="feedback-title">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                </div>
                <p className="feedback-explanation">
                  <MathText text={currentQuestion.explanation} />
                </p>
              </div>
            )}

            <div className="question-actions">
              <button className="btn btn-primary btn-lg" onClick={handleNext} disabled={!showFeedback}>
                Next Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPractice;