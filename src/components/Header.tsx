import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import SyncButton from './SyncButton';
import './Header.css';

const Header = () => {
  const { class: classParam } = useParams<{ class: string }>();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  
  // Only show class-specific links if we're in a class context
  const classPathMatch = location.pathname.match(/^\/class\/([^/]+)/);
  const classLevel = classParam ? Number(classParam) : classPathMatch ? Number(classPathMatch[1]) : null;
  const isInClassContext = classLevel !== null && Number.isFinite(classLevel);
  const showSyncButton = !isInClassContext;
  const handleSyncComplete = () => {
    // Reload the page to show updated data
    window.location.reload();
  };

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsToolsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', closeMenus);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenus);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);
  
  return (
    <header className="header" ref={headerRef}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <span className="logo-icon">📚</span>
            <span className="logo-text">Learning Hub</span>
            {isInClassContext && classLevel && (
              <span className="class-badge">Class {classLevel}</span>
            )}
          </Link>
          <nav className="nav">
            {isInClassContext && classLevel ? (
              <>
                <div className="primary-nav">
                  <Link to={`/class/${classLevel}/dashboard`} className="nav-link">Dashboard</Link>
                  <Link to={`/class/${classLevel}/practice/random/practice`} className="nav-link">Practice</Link>
                  <Link to={`/class/${classLevel}/history`} className="nav-link">History</Link>
                </div>
                <div className="utility-nav">
                  <Link to={`/class/${classLevel}/settings`} className="nav-action">Settings</Link>
                  {showSyncButton && <SyncButton onSyncComplete={handleSyncComplete} />}
                  <Link to="/" className="nav-link">Change Class</Link>
                  <span className="creator-credit">Built by Techy-Abhay</span>
                </div>
                <button
                  className="menu-button"
                  type="button"
                  aria-label="Open utility menu"
                  aria-expanded={isMenuOpen}
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    setIsToolsOpen(false);
                  }}
                  title="More options"
                >
                  ⋮
                </button>
                {isMenuOpen && (
                  <div className="mobile-menu">
                    <span className="menu-class-label">Class {classLevel}</span>
                    <Link to={`/class/${classLevel}/settings`} onClick={() => setIsMenuOpen(false)}>Settings</Link>
                    {showSyncButton && <SyncButton onSyncComplete={handleSyncComplete} />}
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Change Class</Link>
                    <span className="menu-credit">Built by Techy-Abhay</span>
                  </div>
                )}
              </>
            ) : (
              <div className="landing-actions">
                <div className="tools-menu">
                  <button
                    className="nav-action"
                    type="button"
                    aria-expanded={isToolsOpen}
                    onClick={() => {
                      setIsToolsOpen(!isToolsOpen);
                      setIsMenuOpen(false);
                    }}
                  >
                    Tools...
                  </button>
                  {isToolsOpen && (
                    <div className="tools-dropdown">
                      <a href="tools/math-tables.html">Table Practice</a>
                    </div>
                  )}
                </div>
                <SyncButton onSyncComplete={handleSyncComplete} />
                <Link to="/class/6/settings" className="nav-action">Settings</Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
