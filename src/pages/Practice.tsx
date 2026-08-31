import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import * as dataService from '../services/dataService';
import { Question, ClassLevel } from '../types';
import MathText from '../components/MathText';
import { shuffleOptionsForQuestions, ShuffledOption } from '../utils/shuffleOptions';
import APP_CONFIG from '../config/appConfig';
import './Practice.css';

const Practice = () => {
  const { subject, mode, class: classParam } = useParams<{ subject: string; mode: string; class: string }>();
  const classLevel = Number(classParam) as ClassLevel;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topic = searchParams.get('topic');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Map<string, { shuffledOptions: ShuffledOption[]; correctLabel: string }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [startTime] = useState(Date.now());
  
  const isLearningMode = mode === 'random' || mode === 'topic';
  const currentQuestion = questions[currentIndex];

  // Load settings from localStorage
  const getQuestionCount = (practiceType: 'random' | 'topic') => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return practiceType === 'random' 
          ? settings.practiceQuestions || APP_CONFIG.DEFAULT_PRACTICE_QUESTIONS
          : settings.topicQuestions || APP_CONFIG.DEFAULT_TOPIC_QUESTIONS;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return practiceType === 'random' 
      ? APP_CONFIG.DEFAULT_PRACTICE_QUESTIONS 
      : APP_CONFIG.DEFAULT_TOPIC_QUESTIONS;
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        let selectedQuestions: Question[] = [];
        
        if (subject && subject !== 'random') {
          // Fetch questions from backend (with fallback to mock data)
          const apiQuestions = await dataService.getQuestions(subject, topic || undefined);
          console.log(`📚 Received ${apiQuestions.length} questions for ${subject}`, apiQuestions[0]);
          
          // Filter by class on client-side
          const classQuestions = apiQuestions.filter(q => q.class === classLevel);
          console.log(`🎓 After filtering for class ${classLevel}: ${classQuestions.length} questions`);
          
          // Prevent duplicates by shuffling and using slice
          const shuffled = [...classQuestions].sort(() => Math.random() - 0.5);
          
          if (mode === 'random' || mode === 'test') {
            const questionCount = getQuestionCount('random');
            selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
          } else if (mode === 'topic') {
            const questionCount = getQuestionCount('topic');
            selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
          }
          console.log(`✅ Selected ${selectedQuestions.length} unique questions for practice`);
        } else if (subject === 'random') {
          // Fetch questions from all subjects
          const allSubjects = APP_CONFIG.SUBJECTS;
          const allQuestionsArrays = await Promise.all(
            allSubjects.map(s => dataService.getQuestions(s))
          );
          const allQuestions = allQuestionsArrays.flat();
          console.log(`📚 Total questions from all subjects: ${allQuestions.length}`);
          
          // Use Set to ensure unique question IDs
          const uniqueQuestions = allQuestions
            .filter(q => q.class === classLevel)
            .reduce((acc, q) => {
              if (!acc.find(existing => existing.questionId === q.questionId)) {
                acc.push(q);
              }
              return acc;
            }, [] as Question[]);
          
          const questionCount = getQuestionCount('random');
          selectedQuestions = uniqueQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(questionCount, uniqueQuestions.length));
          console.log(`✅ Selected ${selectedQuestions.length} unique random questions`);
        }
        
        setQuestions(selectedQuestions);
        setShuffledOptionsMap(shuffleOptionsForQuestions(selectedQuestions));
        console.log('🎯 Final questions set:', selectedQuestions.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [subject, mode, topic, classLevel]);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.questionId, selectedAnswer);
    setAnswers(newAnswers);
    
    if (isLearningMode) {
      setShowFeedback(true);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Session complete
      finishSession();
    }
  };

  const finishSession = async () => {
    const correctAnswers = Array.from(answers.entries()).filter(
      ([qId, answer]) => {
        const shuffledData = shuffledOptionsMap.get(qId);
        return shuffledData && shuffledData.correctLabel === answer;
      }
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    // Create session object
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const session = {
      sessionId,
      userId: 'local-user', // TODO: Add user authentication
      class: classLevel,
      subject: subject || 'Random',
      topic: topic || null,
      mode: mode === 'random' ? 'Practice' as const : mode === 'topic' ? 'Topic Practice' as const : 'Practice' as const,
      startTime: new Date(startTime).toISOString(),
      endTime: now,
      totalQuestions: questions.length,
      correctAnswers,
      score,
      duration,
      timestamp: now,
      synced: false
    };
    
    // Save session to local storage
    try {
      await dataService.saveSession(session);
      console.log('✅ Session saved to local storage:', sessionId);
      
      // Save session details for review
      await dataService.saveSessionDetails(sessionId, {
        questions: questions.map(q => ({...q})), // Deep copy
        answers: Object.fromEntries(answers),
        shuffledOptionsMap: Object.fromEntries(shuffledOptionsMap),
      });
      console.log('✅ Session details saved for review');
    } catch (error) {
      console.error('❌ Failed to save session:', error);
    }
    
    // Navigate to results
    navigate(`/class/${classLevel}/results/${sessionId}`, {
      state: {
        subject,
        topic,
        mode,
        questions,
        answers: Object.fromEntries(answers),
        shuffledOptionsMap: Object.fromEntries(shuffledOptionsMap),
        score,
        correctAnswers,
        totalQuestions: questions.length,
        duration,
        sessionId,
      }
    });
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
    return (
      <div className="practice">
        <div className="container">
          <p>No questions available</p>
          <button onClick={() => navigate(`/class/${classLevel}/dashboard`)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="practice">
      <div className="container">
        <div className="practice-container">
          {/* Header */}
          <div className="practice-header">
            <div className="practice-info">
              <h2>{subject} {topic && `• ${topic}`}</h2>
              <p className="text-secondary">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <button 
              onClick={() => navigate(`/class/${classLevel}/dashboard`)}
              className="btn btn-secondary"
            >
              Exit
            </button>
          </div>

          {/* Progress */}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="question-card">
            <div className="question-header">
              <span className="badge badge-primary">{currentQuestion.difficulty}</span>
              <span className="badge">{currentQuestion.topic}</span>
            </div>
            
            <h3 className="question-text">
              <MathText text={currentQuestion.question} />
            </h3>
            
            <div className="options">
              {shuffledOptionsMap.get(currentQuestion.questionId)?.shuffledOptions.map(option => {
                const isSelected = selectedAnswer === option.label;
                const correctLabel = shuffledOptionsMap.get(currentQuestion.questionId)?.correctLabel;
                const isCorrectOption = option.label === correctLabel;
                
                let className = 'option';
                if (showFeedback) {
                  if (isCorrectOption) className += ' option-correct';
                  else if (isSelected && !isCorrect) className += ' option-incorrect';
                } else if (isSelected) {
                  className += ' option-selected';
                }
                
                return (
                  <button
                    key={option.label}
                    className={className}
                    onClick={() => handleAnswerSelect(option.label)}
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

            {/* Feedback */}
            {showFeedback && (
              <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
                <div className="feedback-header">
                  <span className="feedback-icon">
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <span className="feedback-title">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="feedback-explanation">
                  <MathText text={currentQuestion.explanation} />
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="question-actions">
              {!showFeedback ? (
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                >
                  Submit Answer
                </button>
              ) : (
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleNext}
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
