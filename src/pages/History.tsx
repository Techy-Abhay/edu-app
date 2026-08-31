import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as dataService from '../services/dataService';
import { ClassLevel, Session } from '../types';
import './History.css';

const History = () => {
  const { class: classParam } = useParams<{ class: string }>();
  const classLevel = Number(classParam) as ClassLevel;
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionsData = await dataService.getSessions(classLevel);
        setSessions(sessionsData);
        console.log(`📚 Loaded ${sessionsData.length} sessions for Class ${classLevel}`);
      } catch (err) {
        console.error('Error loading sessions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSessions();
  }, [classLevel]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const subjectIcons: { [key: string]: string } = {
    'English': '📖',
    'Mathematics': '🔢',
    'Science': '🔬',
    'GK': '🌎',
    'Sports': '⚽',
  };

  // Calculate overall stats
  const totalSessions = sessions.length;
  const totalQuestions = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
  const avgAccuracy = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions)
    : 0;
  const totalTime = Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60);

  if (loading) {
    return (
      <div className="history">
        <div className="container">
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="container">
        <Link to={`/class/${classLevel}/dashboard`} className="back-link">← Back to Dashboard</Link>
        
        <div className="history-header">
          <h1>Practice History</h1>
          <p className="text-secondary">Track your learning progress</p>
        </div>

        {/* Overall Stats */}
        <div className="history-stats">
          <div className="history-stat-card">
            <div className="history-stat-icon">📚</div>
            <div className="history-stat-content">
              <div className="history-stat-value">{totalSessions}</div>
              <div className="history-stat-label">Total Sessions</div>
            </div>
          </div>
          <div className="history-stat-card">
            <div className="history-stat-icon">📝</div>
            <div className="history-stat-content">
              <div className="history-stat-value">{totalQuestions}</div>
              <div className="history-stat-label">Questions Practiced</div>
            </div>
          </div>
          <div className="history-stat-card">
            <div className="history-stat-icon">🎯</div>
            <div className="history-stat-content">
              <div className="history-stat-value">{avgAccuracy}%</div>
              <div className="history-stat-label">Average Accuracy</div>
            </div>
          </div>
          <div className="history-stat-card">
            <div className="history-stat-icon">⏱️</div>
            <div className="history-stat-content">
              <div className="history-stat-value">{totalTime}</div>
              <div className="history-stat-label">Minutes Studied</div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="sessions-section">
          <h2>Recent Sessions</h2>
          {sessions.length === 0 ? (
            <div className="empty-state">
              <p>No practice sessions yet for Class {classLevel}</p>
              <Link to={`/class/${classLevel}/dashboard`} className="btn btn-primary">Start Practicing</Link>
            </div>
          ) : (
            <div className="sessions-list">
              {sessions.map(session => (
                <Link 
                  key={session.sessionId} 
                  to={`/class/${classLevel}/results/${session.sessionId}`}
                  className="session-card"
                >
                  <div className="session-icon">
                    {subjectIcons[session.subject] || '📚'}
                  </div>
                  <div className="session-content">
                    <h3 className="session-title">
                      {session.subject} {session.topic && `• ${session.topic}`}
                    </h3>
                    <div className="session-meta">
                      <span className="session-meta-item">
                        {formatDate(session.startTime)}
                      </span>
                      <span className="session-meta-separator">•</span>
                      <span className="session-meta-item">
                        {session.totalQuestions} questions
                      </span>
                      <span className="session-meta-separator">•</span>
                      <span className="session-meta-item">
                        {formatDuration(session.duration)}
                      </span>
                    </div>
                  </div>
                  <div className="session-score">
                    <div className="session-score-value">{session.score}%</div>
                    <div className="session-score-label">
                      {session.correctAnswers}/{session.totalQuestions} correct
                    </div>
                  </div>
                  <div className="session-badge">
                    {session.score >= 80 ? (
                      <span className="badge badge-success">Excellent</span>
                    ) : session.score >= 60 ? (
                      <span className="badge badge-primary">Good</span>
                    ) : (
                      <span className="badge badge-warning">Practice More</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
