import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import './App.css';

type AppStatus = 'idle' | 'filling' | 'success' | 'error';

function App() {
  const { profile, loading, isAuthenticated, checkAuth } = useAuth();
  const [status, setStatus] = useState<AppStatus>('idle');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  const handleLogin = () => {
    chrome.tabs.create({ url: "http://localhost:3001/login" });
  };

  const handleDashboard = () => {
    chrome.tabs.create({ url: "http://localhost:3001/dashboard" });
  };

  const isSupportedSite = () => {
    // Simple heuristic for now, or check if we injected content script
    // Real implementation would match against a list of domains
    return true; 
    // return currentUrl.includes('nic.in') || currentUrl.includes('nta.ac.in') || currentUrl.includes('mahacet.org') || currentUrl.includes('localhost');
  };

  const handleAutoFill = () => {
    setStatus('filling');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) return;

      const tabId = activeTab.id;
      const payload = { action: "FILL_FORM", data: profile };

      chrome.tabs.sendMessage(tabId, payload, (response) => {
        if (chrome.runtime.lastError) {
          // Injection fallback
          chrome.scripting.executeScript({
            target: { tabId },
            files: ['src/content.js']
          }).then(() => {
            setTimeout(() => {
              chrome.tabs.sendMessage(tabId, payload, (resp) => {
                 if (chrome.runtime.lastError) {
                     setStatus('error');
                     setMessage("Could not connect to page. Refresh and try again.");
                 } else {
                     setStatus('success');
                     setMessage("Form filled successfully!");
                 }
              });
            }, 500);
          }).catch(() => {
             setStatus('error');
             setMessage("Injection failed.");
          });
        } else {
          setStatus('success');
          setMessage("Form filled successfully!");
        }
      });
    });
  };

  if (loading) {
    return (
      <div className="layout">
        <div className="content">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="layout">
        <div className="header">
          <div className="logo">
            <div className="logo-icon">U</div>
            UniApply
          </div>
        </div>
        <div className="content">
          <p className="empty-state">Please login to access your master profile.</p>
          <button className="btn btn-primary" onClick={handleLogin}>Login / Signup</button>
          <button className="btn btn-secondary" onClick={checkAuth}>Refresh Status</button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="header">
        <div className="logo">
          <div className="logo-icon">U</div>
          UniApply
        </div>
        <div className="status-badge">
          <span className="status-dot"></span>
          Connected
        </div>
      </div>
      
      <div className="content">
        {status === 'success' ? (
           <div className="success-message">
              <span style={{ fontSize: '24px' }}>🎉</span>
              <div>
                  <div>Success!</div>
                  <div style={{fontSize: '12px', color: '#64748b', fontWeight: 'normal'}}>Fields auto-filled.</div>
              </div>
           </div>
        ) : (
           <div className="card">
            <h2>{profile?.profile.firstName} {profile?.profile.lastName}</h2>
            <p>DOB: {profile?.profile.dob ? new Date(profile?.profile.dob).toLocaleDateString() : 'N/A'}</p>
            <p style={{marginTop: '4px'}}>Documents Ready: {profile?.documents.length}</p>
          </div>
        )}

        {isSupportedSite() ? (
            <button 
                className="btn btn-primary" 
                onClick={handleAutoFill}
                disabled={status === 'filling'}
            >
                {status === 'filling' ? (
                    <>
                        <div className="loader"></div>
                        Filling...
                    </>
                ) : (
                    status === 'success' ? 'Fill Again' : 'Auto-Fill Form'
                )}
            </button>
        ) : (
            <p className="empty-state">
                Navigate to a supported exam portal to use auto-fill.
            </p>
        )}

        {message && status === 'error' && (
            <p style={{color: '#ef4444', fontSize: '12px', marginTop: '12px'}}>{message}</p>
        )}

        <button className="btn btn-secondary" onClick={handleDashboard}>
            Open Dashboard
        </button>
      </div>
      
      <div className="footer">
        UniApply India • v0.1.0
      </div>
    </div>
  );
}

export default App;