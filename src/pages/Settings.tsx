import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ClassLevel } from '../types';
import APP_CONFIG from '../config/appConfig';
import * as dataService from '../services/dataService';
import './Settings.css';

interface SettingsData {
  practiceQuestions: number;
  topicQuestions: number;
  mockTestQuestions: number;
}

const Settings = () => {
  const { class: classParam } = useParams<{ class: string }>();
  const classLevel = Number(classParam) as ClassLevel;
  
  const [settings, setSettings] = useState<SettingsData>({
    practiceQuestions: APP_CONFIG.DEFAULT_PRACTICE_QUESTIONS,
    topicQuestions: APP_CONFIG.DEFAULT_TOPIC_QUESTIONS,
    mockTestQuestions: APP_CONFIG.DEFAULT_MOCK_TEST_QUESTIONS,
  });
  
  const [saved, setSaved] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(current => ({ ...current, ...parsed }));
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Update APP_CONFIG (for current session)
    APP_CONFIG.DEFAULT_PRACTICE_QUESTIONS = settings.practiceQuestions;
    APP_CONFIG.DEFAULT_TOPIC_QUESTIONS = settings.topicQuestions;
    APP_CONFIG.DEFAULT_MOCK_TEST_QUESTIONS = settings.mockTestQuestions;
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      practiceQuestions: 20,
      topicQuestions: 15,
      mockTestQuestions: 25,
    };
    setSettings(defaultSettings);
    localStorage.removeItem('appSettings');
    APP_CONFIG.DEFAULT_PRACTICE_QUESTIONS = 20;
    APP_CONFIG.DEFAULT_TOPIC_QUESTIONS = 15;
    APP_CONFIG.DEFAULT_MOCK_TEST_QUESTIONS = 25;
  };

  const updateQuestionCount = (setting: keyof SettingsData, value: string) => {
    setSettings({
      ...settings,
      [setting]: Math.min(APP_CONFIG.MAX_QUESTIONS, Math.max(APP_CONFIG.MIN_QUESTIONS, parseInt(value) || APP_CONFIG.MIN_QUESTIONS))
    });
  };

  const toggleAllQuestions = (setting: keyof SettingsData, checked: boolean) => {
    setSettings({ ...settings, [setting]: checked ? 0 : APP_CONFIG.MIN_QUESTIONS });
  };

  const handleClearCache = async () => {
    if (!window.confirm('Clear downloaded questions and topics? Your settings and practice history will be kept.')) return;
    await dataService.clearCachedData();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <div className="settings">
      <div className="container">
        <Link to={`/class/${classLevel}/dashboard`} className="back-link">← Back to Dashboard</Link>
        
        <div className="settings-container">
          <div className="settings-header">
            <h1>⚙️ Settings</h1>
            <p className="text-secondary">Configure your learning preferences</p>
          </div>

          <div className="settings-section">
            <h2>Practice Configuration</h2>
            <p className="section-description">
              Set the default number of questions for practice sessions
            </p>

            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-label">
                  <label htmlFor="practiceQuestions">Random Practice Questions</label>
                  <span className="setting-hint">
                    Number of questions in Random Practice sessions
                  </span>
                </div>
                <div className="setting-control">
                  <input
                    type="number"
                    id="practiceQuestions"
                    min={APP_CONFIG.MIN_QUESTIONS}
                    max={APP_CONFIG.MAX_QUESTIONS}
                    value={settings.practiceQuestions || ''}
                    onChange={(e) => updateQuestionCount('practiceQuestions', e.target.value)}
                    disabled={settings.practiceQuestions === 0}
                    className="setting-input"
                  />
                  <span className="setting-range">
                    ({APP_CONFIG.MIN_QUESTIONS}-{APP_CONFIG.MAX_QUESTIONS})
                  </span>
                  <label className="setting-checkbox">
                    <input type="checkbox" checked={settings.practiceQuestions === 0} onChange={(e) => toggleAllQuestions('practiceQuestions', e.target.checked)} />
                    All available
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <label htmlFor="topicQuestions">Topic Practice Questions</label>
                  <span className="setting-hint">
                    Number of questions when practicing a specific topic
                  </span>
                </div>
                <div className="setting-control">
                  <input
                    type="number"
                    id="topicQuestions"
                    min={APP_CONFIG.MIN_QUESTIONS}
                    max={APP_CONFIG.MAX_QUESTIONS}
                    value={settings.topicQuestions || ''}
                    onChange={(e) => updateQuestionCount('topicQuestions', e.target.value)}
                    disabled={settings.topicQuestions === 0}
                    className="setting-input"
                  />
                  <span className="setting-range">
                    ({APP_CONFIG.MIN_QUESTIONS}-{APP_CONFIG.MAX_QUESTIONS})
                  </span>
                  <label className="setting-checkbox">
                    <input type="checkbox" checked={settings.topicQuestions === 0} onChange={(e) => toggleAllQuestions('topicQuestions', e.target.checked)} />
                    All available
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <label htmlFor="mockTestQuestions">Mock Test Questions</label>
                  <span className="setting-hint">
                    Number of questions in each Mock Test
                  </span>
                </div>
                <div className="setting-control">
                  <input
                    type="number"
                    id="mockTestQuestions"
                    min={APP_CONFIG.MIN_QUESTIONS}
                    max={APP_CONFIG.MAX_QUESTIONS}
                    value={settings.mockTestQuestions || ''}
                    onChange={(e) => updateQuestionCount('mockTestQuestions', e.target.value)}
                    disabled={settings.mockTestQuestions === 0}
                    className="setting-input"
                  />
                  <span className="setting-range">
                    ({APP_CONFIG.MIN_QUESTIONS}-{APP_CONFIG.MAX_QUESTIONS})
                  </span>
                  <label className="setting-checkbox">
                    <input type="checkbox" checked={settings.mockTestQuestions === 0} onChange={(e) => toggleAllQuestions('mockTestQuestions', e.target.checked)} />
                    All available
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Data</h2>
            <p className="section-description">Remove downloaded questions and topics before a fresh sync. Your settings and practice history are kept.</p>
            <button onClick={handleClearCache} className="btn btn-secondary">Clear Local Cache</button>
            {cacheCleared && <div className="cache-notification">Local cache cleared. Use Sync Data to download the latest questions and topics.</div>}
          </div>

          <div className="settings-section">
            <h2>Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">📊</div>
                <div className="info-content">
                  <div className="info-label">Total Subjects</div>
                  <div className="info-value">{APP_CONFIG.SUBJECTS.length}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📝</div>
                <div className="info-content">
                  <div className="info-label">Min Questions</div>
                  <div className="info-value">{APP_CONFIG.MIN_QUESTIONS}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📚</div>
                <div className="info-content">
                  <div className="info-label">Max Questions</div>
                  <div className="info-value">{APP_CONFIG.MAX_QUESTIONS}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">⏰</div>
                <div className="info-content">
                  <div className="info-label">Cache Duration</div>
                  <div className="info-value">{APP_CONFIG.CACHE_DURATION_HOURS}h</div>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button onClick={handleReset} className="btn btn-secondary">
              Reset to Defaults
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              {saved ? '✓ Saved!' : 'Save Settings'}
            </button>
          </div>

          {saved && (
            <div className="save-notification">
              ✓ Settings saved successfully! Changes will apply to new practice sessions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
