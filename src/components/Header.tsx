import { Link, useParams, useLocation } from 'react-router-dom';
import SyncButton from './SyncButton';
import './Header.css';

const Header = () => {
  const { class: classParam } = useParams<{ class: string }>();
  const location = useLocation();
  
  // Only show class-specific links if we're in a class context
  const classPathMatch = location.pathname.match(/^\/class\/([^/]+)/);
  const classLevel = classParam ? Number(classParam) : classPathMatch ? Number(classPathMatch[1]) : null;
  const isInClassContext = classLevel !== null && Number.isFinite(classLevel);
  
  const handleSyncComplete = () => {
    // Reload the page to show updated data
    window.location.reload();
  };
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">My Learning Hub</span>
            {isInClassContext && classLevel && (
              <span className="class-badge">Class {classLevel}</span>
            )}
          </Link>
          <nav className="nav">
            {isInClassContext && classLevel ? (
              <>
                <Link to={`/class/${classLevel}/dashboard`} className="nav-link">Dashboard</Link>
                <Link to={`/class/${classLevel}/history`} className="nav-link">History</Link>
                <Link to={`/class/${classLevel}/settings`} className="nav-link settings-link">⚙️ Settings</Link>
                <SyncButton onSyncComplete={handleSyncComplete} />
                <Link to="/" className="nav-link nav-link-secondary">Change Class</Link>
              </>
            ) : (
              <Link to="/" className="nav-link">Select Class</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
