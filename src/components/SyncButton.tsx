import { useState } from 'react';
import * as dataService from '../services/dataService';
import './SyncButton.css';

interface SyncButtonProps {
  onSyncComplete?: () => void;
}

const SyncButton = ({ onSyncComplete }: SyncButtonProps) => {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    setShowMessage(false);
    
    try {
      const result = await dataService.syncFromServer();
      setMessage(result.message);
      setShowMessage(true);
      
      // Hide message after 5 seconds
      setTimeout(() => setShowMessage(false), 5000);
      
      // Callback to refresh UI
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      setMessage('Sync failed. Please try again.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="sync-button-wrapper">
      <button 
        className={`sync-button ${syncing ? 'syncing' : ''}`}
        onClick={handleSync}
        disabled={syncing}
        title="Sync with server to get latest questions"
      >
        {syncing ? 'Syncing...' : 'Sync Data'}
      </button>
      
      {showMessage && (
        <div className="sync-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default SyncButton;
