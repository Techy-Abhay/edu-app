import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as dataService from '../services/dataService';
import { Question, Topic, ClassLevel } from '../types';
import './SubjectSelection.css';

const SubjectSelection = () => {
  const { subject, class: classParam } = useParams<{ subject: string; class: string }>();
  const classLevel = Number(classParam) as ClassLevel;
  const [topics, setTopics] = useState<Topic[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!subject) return;
        
        const [topicsData, questionsData] = await Promise.all([
          dataService.getTopics(subject),
          dataService.getQuestions(subject)
        ]);
        
        // Filter by class on client-side
        const filteredTopics = topicsData.filter(t => t.class === classLevel);
        const filteredQuestions = questionsData.filter(q => q.class === classLevel);
        
        console.log(`📚 ${subject} - Total topics: ${topicsData.length}, Filtered for Class ${classLevel}: ${filteredTopics.length}`);
        console.log(`📝 ${subject} - Total questions: ${questionsData.length}, Filtered for Class ${classLevel}: ${filteredQuestions.length}`);
        console.log('Topics:', filteredTopics);
        
        setTopics(filteredTopics);
        setAllQuestions(filteredQuestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [subject, classLevel]);

  const subjectIcons: { [key: string]: string } = {
    'English': '📖',
    'Mathematics': '🔢',
    'Science': '🔬',
    'GK': '🌎',
    'Sports': '⚽',
  };

  if (loading) {
    return (
      <div className="subject-selection">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subject-selection">
        <div className="container">
          <div className="error-message">
            <p>Error: {error}</p>
            <Link to={`/class/${classLevel}/dashboard`} className="btn btn-primary">
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subject-selection">
      <div className="container">
        <Link to={`/class/${classLevel}/dashboard`} className="back-link">← Back to Dashboard</Link>
        
        <div className="subject-header">
          <span className="subject-icon-large">
            {subjectIcons[subject || ''] || '📚'}
          </span>
          <div>
            <h1>{subject}</h1>
            <p className="text-secondary">{allQuestions.length} questions available</p>
          </div>
        </div>

        {/* Practice Modes */}
        <div className="section">
          <h2>Practice Modes</h2>
          <div className="mode-grid">
            <Link 
              to={`/class/${classLevel}/practice/${subject}/random`}
              className="mode-card"
            >
              <span className="mode-icon">🎲</span>
              <h3>Random Practice</h3>
              <p>Mix of all topics</p>
            </Link>
            <Link 
              to={`/class/${classLevel}/practice/${subject}/test`}
              className="mode-card"
            >
              <span className="mode-icon">📝</span>
              <h3>Mock Test</h3>
              <p>Practice exam with a set question count</p>
            </Link>
          </div>
        </div>

        {/* Topics */}
        <div className="section">
          <h2>Practice by Topic</h2>
          {topics.length === 0 ? (
            <div className="empty-state">
              <p>No topics available for Class {classLevel} yet.</p>
              <p className="text-secondary">Topics may need to be synced from the server.</p>
            </div>
          ) : (
            <div className="topic-grid">
              {topics.map(topic => {
                const topicQuestions = allQuestions.filter(q => q.topic === topic.topicName);
                return (
                  <Link 
                    key={topic.topicId}
                    to={`/class/${classLevel}/practice/${subject}/topic?topic=${topic.topicName}`}
                    className="topic-card"
                  >
                    <h3>{topic.topicName}</h3>
                    <p className="topic-description">{topic.description}</p>
                    <div className="topic-meta">
                      <span className="badge">{topicQuestions.length} questions</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
