import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Mapper } from './components/Mapper';
import './App.css';

function App() {
  const { profile, loading, isAuthenticated, checkAuth } = useAuth();
  const [devMode, setDevMode] = useState(false);

  const handleLogin = () => {
    chrome.tabs.create({ url: "http://localhost:3001/login" });
  };

  const handleAutoFill = () => {
    console.log("Auto-Fill clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) {
        console.error("No active tab found");
        return;
      }

      const tabId = activeTab.id;
      const message = { action: "FILL_FORM", data: profile };

      console.log("Sending message to tab ID:", tabId);
      
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("Message failed:", chrome.runtime.lastError.message);
          console.log("Attempting programmatic injection...");

          chrome.scripting.executeScript({
            target: { tabId },
            files: ['src/content.js']
          }).then(() => {
            console.log("Injection successful. Retrying message...");
            setTimeout(() => {
              chrome.tabs.sendMessage(tabId, message, (resp) => {
                if (chrome.runtime.lastError) {
                  console.error("Retry failed:", chrome.runtime.lastError.message);
                } else {
                  console.log("Retry response:", resp);
                }
              });
            }, 100);
          }).catch((err) => {
            console.error("Injection failed:", err);
          });

        } else {
          console.log("Message response:", response);
        }
      });
    });
  };

  const handleInspect = () => {
    // Legacy Inspector - kept for quick debug
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => {
            console.group("UniApply Form Inspector");
            const inputs = document.querySelectorAll("input, select, textarea");
            const report = Array.from(inputs).map((el: any) => ({
              tag: el.tagName,
              type: el.type,
              id: el.id,
              name: el.name,
              class: el.className,
              placeholder: el.placeholder,
              label: el.labels?.[0]?.innerText || "No Label"
            }));
            console.table(report);
            console.log("JSON Report:", JSON.stringify(report, null, 2));
            console.groupEnd();
            alert("Form details logged to Console (F12)");
          }
        });
      }
    });
  };

  if (loading) {
    return <div className="container">Loading UniApply...</div>;
  }

  // If in Dev Mode, show Mapper Interface regardless of auth (mostly)
  if (devMode) {
    return (
      <div className="container">
        <Mapper />
        <div className="footer" style={{ marginTop: '16px' }}>
          <label>
            <input type="checkbox" checked={devMode} onChange={(e) => setDevMode(e.target.checked)} />
            Dev Mode
          </label>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h1>UniApply</h1>
        <p>Please login to your account to use the assistant.</p>
        <button onClick={handleLogin}>Login</button>
        <button className="secondary" onClick={checkAuth}>Refresh Status</button>
        
        <div className="footer" style={{ marginTop: '24px' }}>
          <label style={{ fontSize: '10px', color: '#ccc' }}>
            <input type="checkbox" checked={devMode} onChange={(e) => setDevMode(e.target.checked)} />
            Dev Mode
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>UniApply</h1>
        <span className="badge">Active</span>
      </div>
      
      <div className="card">
        <h2>{profile?.profile.firstName} {profile?.profile.lastName}</h2>
        <p>DOB: {profile?.profile.dob ? new Date(profile?.profile.dob).toLocaleDateString() : 'N/A'}</p>
        <p>Docs: {profile?.documents.length}</p>
      </div>

      <div className="actions">
        <button className="primary" onClick={handleAutoFill}>
          Auto-Fill This Form
        </button>
      </div>

      <div className="dev-tools" style={{ display: 'none' }}>
        <h3>Developer Tools</h3>
        <button className="secondary" onClick={handleInspect}>
          Inspect Page Forms
        </button>
      </div>
      
      <div className="footer">
        <p>Target: MHT CET 2026</p>
        <label style={{ fontSize: '10px', color: '#ccc', display: 'block', marginTop: '8px' }}>
          <input type="checkbox" checked={devMode} onChange={(e) => setDevMode(e.target.checked)} />
          Dev Mode
        </label>
      </div>
    </div>
  );
}

export default App;