import { useNavigate } from 'react-router-dom';
import { ClassLevel } from '../types';
import './ClassSelection.css';

const CLASS_INFO: Array<{ level: ClassLevel; name: string; description: string; icon: string }> = [
  { level: 6, name: 'Class 6', description: 'Foundation building year', icon: '📚' },
  { level: 7, name: 'Class 7', description: 'Intermediate concepts', icon: '📖' },
  { level: 8, name: 'Class 8', description: 'Advanced fundamentals', icon: '📝' },
  { level: 9, name: 'Class 9', description: 'Board exam preparation', icon: '🎯' },
  { level: 10, name: 'Class 10', description: 'CBSE/ICSE board year', icon: '🏆' },
];

export default function ClassSelection() {
  const navigate = useNavigate();

  const handleClassSelect = (classLevel: ClassLevel) => {
    navigate(`/class/${classLevel}/dashboard`);
  };

  return (
    <div className="class-selection">
      <div className="class-selection-header">
        <h1>🎓 Select Your Class</h1>
        <p>Choose your current class to start practicing</p>
      </div>

      <div className="class-grid">
        {CLASS_INFO.map(({ level, name, description, icon }) => (
          <button
            key={level}
            className="class-card"
            onClick={() => handleClassSelect(level)}
          >
            <div className="class-icon">{icon}</div>
            <div className="class-content">
              <h2>{name}</h2>
              <p>{description}</p>
            </div>
            <div className="class-arrow">→</div>
          </button>
        ))}
      </div>

      <div className="class-selection-footer">
        <p>💡 You can switch classes anytime from the header menu</p>
      </div>
    </div>
  );
}
