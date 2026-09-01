import { useParams, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as dataService from '../services/dataService';
import { ClassLevel, Session } from '../types';
import MathText from '../components/MathText';
import './Results.css';

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const getPerformanceLevel = (score: number) => {
  if (score >= 90) return { label: 'Excellent!', class: 'excellent', emoji: '🌟' };
  if (score >= 75) return { label: 'Great Job!', class: 'great', emoji: '🎉' };
  if (score >= 60) return { label: 'Good Effort!', class: 'good', emoji: '👍' };
  return { label: 'Keep Practicing!', class: 'needs-practice', emoji: '💪' };
};

type ShuffledData = {
  correctLabel: string;
  shuffledOptions: Array<{ label: string; text: string }>;
};

const toOptionsMap = (raw: unknown) =>
  new Map<string, ShuffledData>(Object.entries((raw || {}) as Record<string, ShuffledData>));

const Results = () => {
  const { class: classParam, sessionId } = useParams<{ class: string; sessionId?: string }>();
  const classLevel = Number(classParam) as ClassLevel;
  const location = useLocation();
  const sessionData = location.state;
  
  const [session, setSession] = useState<Session | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load session from localStorage if not passed via state
  useEffect(() => {
    if (!sessionData && sessionId) {
      setLoading(true);
      Promise.all([
        dataService.getSessionById(sessionId),
        dataService.getSessionDetails(sessionId)
      ]).then(([loadedSession, details]) => {
        if (loadedSession) {
          setSession(loadedSession);
          setSessionDetails(details);
        }
        setLoading(false);
      }).catch(err => {
        console.error('Failed to load session:', err);
        setLoading(false);
      });
    }
  }, [sessionData, sessionId]);

  if (loading) {
    return (
      <div className="results">
        <div className="container">
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  // Show summary view if loaded from localStorage (no detailed review)
  if (session && !sessionData) {
    const performance = getPerformanceLevel(session.score);
    
    return (
      <div className="results">
        <div className="container">
          <Link to={`/class/${classLevel}/history`} className="back-link">← Back to History</Link>
          
          <div className="results-container">
            <div className="results-header">
              <h1>Session Summary {performance.emoji}</h1>
              <p className="text-secondary">
                {session.subject} {session.topic && `• ${session.topic}`}
              </p>
            </div>

            <div className={`score-card ${performance.class}`}>
              <div className="score-main">
                <div className="score-percentage">{session.score}%</div>
                <div className="score-label">{performance.label}</div>
              </div>
              <div className="score-details">
                <div className="score-detail">
                  <span className="score-detail-value">{session.correctAnswers}</span>
                  <span className="score-detail-label">Correct</span>
                </div>
                <div className="score-detail">
                  <span className="score-detail-value">{session.totalQuestions - session.correctAnswers}</span>
                  <span className="score-detail-label">Incorrect</span>
                </div>
                <div className="score-detail">
                  <span className="score-detail-value">{formatDuration(session.duration)}</span>
                  <span className="score-detail-label">Time</span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h2>Performance Summary</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-value">{session.totalQuestions}</div>
                    <div className="stat-label">Total Questions</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <div className="stat-value">{session.correctAnswers}</div>
                    <div className="stat-label">Correct Answers</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">❌</div>
                  <div className="stat-content">
                    <div className="stat-value">{session.totalQuestions - session.correctAnswers}</div>
                    <div className="stat-label">Incorrect Answers</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-content">
                    <div className="stat-value">{Math.round(session.duration / session.totalQuestions)}s</div>
                    <div className="stat-label">Avg. Time/Question</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Review Section */}
            {sessionDetails && sessionDetails.questions && (
              <div className="review-section">
                <h2>Question Review</h2>
                <div className="review-list">
                  {sessionDetails.questions.map((question: any, index: number) => {
                    const optionsMap = toOptionsMap(sessionDetails.shuffledOptionsMap);
                    const shuffledData = optionsMap.get(question.questionId);
                    const userAnswer = sessionDetails.answers[question.questionId];
                    const correctLabel = shuffledData?.correctLabel || question.correctAnswer;
                    const isCorrect = userAnswer === correctLabel;
                    
                    // Debug logging for N/A issue
                    if (!userAnswer) {
                      console.warn('⚠️ No answer recorded for question', question.questionId, {
                        questionId: question.questionId,
                        answersKeys: Object.keys(sessionDetails.answers),
                        shuffledDataExists: !!shuffledData
                      });
                    }
                    
                    // Find the text for user's answer and correct answer
                    const userOption = shuffledData?.shuffledOptions.find((opt: any) => opt.label === userAnswer);
                    const correctOption = shuffledData?.shuffledOptions.find((opt: any) => opt.label === correctLabel);
                    
                    return (
                      <div key={question.questionId} className={`review-item ${isCorrect ? 'review-item-correct' : 'review-item-incorrect'}`}>
                        <div className="review-header">
                          <span className="review-number">Question {index + 1}</span>
                          <span className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <h3 className="review-question">
                          <MathText text={question.question} />
                        </h3>
                        <div className="review-answers">
                          <div className={`review-answer ${isCorrect ? 'review-answer-correct' : 'review-answer-wrong'}`}>
                            <span className="review-answer-label">Your answer:</span>
                            <span className="review-answer-value">
                              {userAnswer ? (
                                <><MathText text={`${userAnswer} - ${userOption?.text || question[`option${userAnswer}`] || 'N/A'}`} /></>
                              ) : (
                                <span className="text-muted">Not answered</span>
                              )}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="review-answer review-answer-correct">
                              <span className="review-answer-label">Correct answer:</span>
                              <span className="review-answer-value">
                                {correctLabel} - <MathText text={correctOption?.text || question[`option${correctLabel}`]} />
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="review-explanation">
                          <strong>Explanation:</strong> <MathText text={question.explanation} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="results-actions">
              <Link to={`/class/${classLevel}/history`} className="btn btn-secondary">
                Back to History
              </Link>
              <Link to={`/class/${classLevel}/dashboard`} className="btn btn-secondary">
                Dashboard
              </Link>
              <Link 
                to={`/class/${classLevel}/practice/${session.subject}/random`}
                className="btn btn-primary"
              >
                Practice Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="results">
        <div className="container">
          <Link to={`/class/${classLevel}/dashboard`} className="back-link">← Back to Dashboard</Link>
          <p>Session not found</p>
          <Link to={`/class/${classLevel}/dashboard`} className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const {
    subject,
    topic,
    questions,
    answers,
    shuffledOptionsMap,
    score,
    correctAnswers,
    totalQuestions,
    duration,
  } = sessionData;

  // Convert shuffledOptionsMap back to Map if it's an object
  const optionsMap = toOptionsMap(shuffledOptionsMap);

  const incorrectQuestions = questions.filter((q: any) => {
    const shuffledData = optionsMap.get(q.questionId);
    return shuffledData && answers[q.questionId] !== shuffledData.correctLabel;
  });

  const performance = getPerformanceLevel(score);

  return (
    <div className="results">
      <div className="container">
        <Link to={`/class/${classLevel}/dashboard`} className="back-link">← Back to Dashboard</Link>
        
        <div className="results-container">
          {/* Header */}
          <div className="results-header">
            <h1>Session Complete! {performance.emoji}</h1>
            <p className="text-secondary">
              {subject} {topic && `• ${topic}`}
            </p>
          </div>

          {/* Score Card */}
          <div className={`score-card ${performance.class}`}>
            <div className="score-main">
              <div className="score-percentage">{score}%</div>
              <div className="score-label">{performance.label}</div>
            </div>
            <div className="score-details">
              <div className="score-detail">
                <span className="score-detail-value">{correctAnswers}</span>
                <span className="score-detail-label">Correct</span>
              </div>
              <div className="score-detail">
                <span className="score-detail-value">{totalQuestions - correctAnswers}</span>
                <span className="score-detail-label">Incorrect</span>
              </div>
              <div className="score-detail">
                <span className="score-detail-value">{formatDuration(duration)}</span>
                <span className="score-detail-label">Time</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-section">
            <h2>Performance Summary</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{totalQuestions}</div>
                  <div className="stat-label">Total Questions</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">{correctAnswers}</div>
                  <div className="stat-label">Correct Answers</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <div className="stat-value">{totalQuestions - correctAnswers}</div>
                  <div className="stat-label">Incorrect Answers</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-value">{Math.round(duration / totalQuestions)}s</div>
                  <div className="stat-label">Avg. Time/Question</div>
                </div>
              </div>
            </div>
          </div>

          {/* Incorrect Questions */}
          {incorrectQuestions.length > 0 && (
            <div className="review-section">
              <h2>Review Mistakes ({incorrectQuestions.length})</h2>
              <div className="review-list">
                {incorrectQuestions.map((question: any, index: number) => (
                  <div key={question.questionId} className="review-item">
                  {(() => {
                    const shuffledData = optionsMap.get(question.questionId);
                    const userAnswer = answers[question.questionId];
                    const correctLabel = shuffledData?.correctLabel || question.correctAnswer;
                    
                    // Find the text for user's answer and correct answer
                    const userOption = shuffledData?.shuffledOptions.find((opt: any) => opt.label === userAnswer);
                    const correctOption = shuffledData?.shuffledOptions.find((opt: any) => opt.label === correctLabel);
                    
                    return (
                      <>
                        <div className="review-header">
                          <span className="review-number">Question {index + 1}</span>
                          <span className="badge badge-danger">Incorrect</span>
                        </div>
                        <h3 className="review-question">{question.question}</h3>
                        <div className="review-answers">
                          <div className="review-answer review-answer-wrong">
                            <span className="review-answer-label">Your answer:</span>
                            <span className="review-answer-value">
                              {userAnswer ? (
                                <>{userAnswer} - {userOption?.text || question[`option${userAnswer}`] || 'N/A'}</>
                              ) : (
                                <span className="text-muted">Not answered</span>
                              )}
                            </span>
                          </div>
                          <div className="review-answer review-answer-correct">
                            <span className="review-answer-label">Correct answer:</span>
                            <span className="review-answer-value">
                              {correctLabel} - {correctOption?.text || question[`option${correctLabel}`]}
                            </span>
                          </div>
                        </div>
                        <div className="review-explanation">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      </>
                    );
                  })()}
                </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="results-actions">
            <Link to={`/class/${classLevel}/dashboard`} className="btn btn-secondary">
              Back to Dashboard
            </Link>
            <Link 
              to={`/class/${classLevel}/practice/${subject}/${sessionData.mode}`}
              className="btn btn-primary"
            >
              Practice Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
