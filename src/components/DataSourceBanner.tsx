import { useState, useEffect } from 'react';
import { isUsingApi, enableApi } from '../services/dataService';
import './DataSourceBanner.css';

const DataSourceBanner = () => {
  const [usingApi, setUsingApi] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkDataSource = () => {
      setUsingApi(isUsingApi());
    };

    // Check immediately
    checkDataSource();

    // Check periodically
    const interval = setInterval(checkDataSource, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    enableApi();
    setUsingApi(true);
    setDismissed(false);
    window.location.reload();
  };

  if (usingApi || dismissed) {
    return null;
  }

  return (
    <div className="data-source-banner">
      <div className="banner-content">
        <span className="banner-icon">ℹ️</span>
        <div className="banner-text">
          <strong>Using offline mode</strong>
          <span className="banner-detail">
            Could not connect to Google Sheets. Using sample data (25 questions).
          </span>
        </div>
        <div className="banner-actions">
          <button onClick={handleRetry} className="banner-btn retry">
            Retry
          </button>
          <button onClick={() => setDismissed(true)} className="banner-btn dismiss">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSourceBanner;
