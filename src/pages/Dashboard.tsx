import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as dataService from '../services/dataService';
import { ClassLevel, Session } from '../types';
import './Dashboard.css';

const subjectIcons: { [key: string]: string } = {
  'English': '📖',
  'Mathematics': '🔢',
  'Science': '🔬',
  'GK': '🌎',
  'Sports': '⚽',
};

const Dashboard = () => {
  const { class: classParam } = useParams<{ class: string }>();
  const classLevel = Number(classParam) as ClassLevel;
  
  const [subjects, setSubjects] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load subjects
        const subjectsData = await dataService.getSubjects();
        setSubjects(subjectsData.map(s => s.name));
        
        // Load sessions from local storage
        const sessionsData = await dataService.getSessions(classLevel);
        setSessions(sessionsData);
        console.log(`📊 Loaded ${sessionsData.length} sessions for Class ${classLevel}`);
      } catch (err) {
        console.error('Error loading data:', err);
        // Fallback to known subjects if API fails
        setSubjects(['English', 'Mathematics', 'Science', 'GK', 'Sports']);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [classLevel]);
  
  // Calculate today's stats from sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.timestamp);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });
  
  const todayStats = {
    questionsAnswered: todaySessions.reduce((sum, s) => sum + s.totalQuestions, 0),
    accuracy: todaySessions.length > 0 
      ? Math.round(todaySessions.reduce((sum, s) => sum + s.score, 0) / todaySessions.length)
      : 0,
    studyTime: Math.round(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60), // Convert to minutes
  };
  
  // Calculate subject-wise stats
  const subjectStats = subjects.map(subject => {
    const subjectSessions = sessions.filter(s => s.subject === subject);
    return {
      subject,
      sessionsCount: subjectSessions.length,
      accuracy: subjectSessions.length > 0
        ? Math.round(subjectSessions.reduce((sum, s) => sum + s.score, 0) / subjectSessions.length)
        : 0,
      totalQuestions: subjectSessions.reduce((sum, s) => sum + s.totalQuestions, 0),
    };
  });

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back! 👋</h1>
          <p className="text-secondary">Class {classLevel} • Let's continue learning</p>
        </div>

        {/* Today's Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Questions Today</div>
              <div className="stat-value">{todayStats.questionsAnswered}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Accuracy</div>
              <div className="stat-value">{todayStats.accuracy}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-label">Study Time</div>
              <div className="stat-value">{todayStats.studyTime} min</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <Link to={`/class/${classLevel}/practice/random/practice`} className="action-card action-primary">
              <span className="action-icon">🎲</span>
              <h3>Random Practice</h3>
              <p>Mix of all subjects</p>
            </Link>
            <Link to={`/class/${classLevel}/quick-practice`} className="action-card action-quick">
              <span className="action-icon">⚡</span>
              <h3>Quick Practice</h3>
              <p>Unlimited questions, no score</p>
            </Link>
            <Link to={`/class/${classLevel}/history`} className="action-card action-secondary">
              <span className="action-icon">📝</span>
              <h3>Review Mistakes</h3>
              <p>Learn from errors</p>
            </Link>
          </div>
        </div>

        {/* Subjects */}
        <div className="section">
          <h2>Subjects</h2>
          <div className="subject-grid">
            {subjectStats.map(({ subject, accuracy, sessionsCount }) => (
              <Link 
                key={subject} 
                to={`/class/${classLevel}/subject/${subject}`}
                className="subject-card"
              >
                <div className="subject-header">
                  <span className="subject-icon">{subjectIcons[subject] || '📚'}</span>
                  <h3>{subject}</h3>
                </div>
                <div className="subject-stats">
                  <div className="subject-stat">
                    <span className="subject-stat-label">Accuracy</span>
                    <span className="subject-stat-value">{accuracy}%</span>
                  </div>
                  <div className="subject-stat">
                    <span className="subject-stat-label">Sessions</span>
                    <span className="subject-stat-value">{sessionsCount}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {sessions.length === 0 ? (
              <div className="empty-state">
                <p>No practice sessions yet</p>
                <p className="text-secondary">Complete a practice session to see your activity here!</p>
              </div>
            ) : (
              sessions.slice(0, 5).map(session => (
                <Link 
                  key={session.sessionId}
                  to={`/class/${classLevel}/results/${session.sessionId}`}
                  className="activity-item"
                >
                  <div className="activity-icon">
                    {subjectIcons[session.subject] || '📚'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {session.subject} {session.topic && `• ${session.topic}`}
                    </div>
                    <div className="activity-meta">
                      {session.totalQuestions} questions • {session.score}% accuracy
                    </div>
                  </div>
                  <div className="activity-badge">
                    {session.score >= 80 ? (
                      <span className="badge badge-success">Excellent</span>
                    ) : session.score >= 60 ? (
                      <span className="badge badge-primary">Good</span>
                    ) : (
                      <span className="badge badge-warning">Needs Practice</span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
