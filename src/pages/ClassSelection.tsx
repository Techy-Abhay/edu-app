import { useNavigate } from 'react-router-dom';
import { ClassLevel } from '../types';
import './ClassSelection.css';

const CLASS_INFO: Array<{ level: ClassLevel; name: string; description: string; icon: string }> = [
  { level: 6, name: 'Class 6', description: 'Foundation building year', icon: '📚' },
  { level: 7, name: 'Class 7', description: 'Intermediate concepts', icon: '📖' },
  { level: 8, name: 'Class 8', description: 'Advanced fundamentals', icon: '📝' },
  { level: 9, name: 'Class 9', description: 'Board exam preparation', icon: '🎯' },
  { level: 10, name: 'Class 10', description: 'Board exam preparation', icon: '🏆' },
];

const AVAILABLE_CLASSES: ClassLevel[] = [6];

export default function ClassSelection() {
  const navigate = useNavigate();

  return (
    <div className="class-selection">
      <div className="class-selection-header">
        <h1>📚 Learning Hub</h1>
        <p>Practice and review your Class 6 learning.</p>
      </div>

      <div className="class-grid">
        {CLASS_INFO.map(({ level, name, description, icon }) => {
          const isAvailable = AVAILABLE_CLASSES.includes(level);

          return (
            <button
              key={level}
              className={`class-card ${isAvailable ? '' : 'class-card-disabled'}`}
              onClick={() => navigate(`/class/${level}/dashboard`)}
              disabled={!isAvailable}
            >
              <div className="class-icon">{icon}</div>
              <div className="class-content">
                <h2>{name}</h2>
                <p>{isAvailable ? description : 'Coming soon'}</p>
              </div>
              {isAvailable && <div className="class-arrow">→</div>}
            </button>
          );
        })}
      </div>

      <div className="class-selection-footer">
        <p className="landing-credit">Built by Techy-Abhay</p>
      </div>
    </div>
  );
}
