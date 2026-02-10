import { useState } from 'react';
import { type SkeletonField } from '../utils/domScanner';

export function Mapper() {
  const [skeleton, setSkeleton] = useState<SkeletonField[]>([]);
  const [scanning, setScanning] = useState(false);
  const [mapping, setMapping] = useState(false);

  const handleScan = () => {
    setScanning(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => {
             // We can't import DomScanner directly inside executeScript (context isolation)
             // So we have to copy the logic OR rely on it being injected.
             // For simplicity in this dev tool, we'll keep the logic here for now, 
             // BUT normally we'd inject `content.js` which has `DomScanner`.
             
             // ... actually, let's try to use the DomScanner if it's available in window context
             // or just duplicate the logic for the "Dev Tool" only.
             
             // REVERTING STRATEGY: 
             // Since Mapper runs in SidePanel (its own DOM), it cannot scan the Page DOM directly via imports.
             // It must inject a script.
             // The cleanest way is to send a message to the Content Script to "SCAN_DOM".
             
             chrome.runtime.sendMessage({ action: "SCAN_DOM" }, () => {
                // This message goes to background, need to forward to content script?
                // Actually, executeScript is easier for "Dev Mode".
             });
             
             // Let's stick to the inline function for the "Dev Tool" to avoid complex messaging for now,
             // But update it to match the logic of DomScanner.ts exactly.
             
             // Helper to find nearest section header
            const getContext = (el: Element): string => {
              let current: Element | null = el.parentElement;
              while (current && current !== document.body) {
                const header = current.querySelector('h1, h2, h3, h4, legend, .card-title, .section-header');
                if (header) return (header as HTMLElement).innerText.trim();
                current = current.parentElement;
              }
              return "General";
            };

            const inputs = document.querySelectorAll("input, select, textarea");
            return Array.from(inputs).map((el: any) => {
              // 1. Label Heuristics
              let labelText = "No Label";
              if (el.labels && el.labels.length > 0) {
                labelText = el.labels[0].innerText;
              } else if (el.id) {
                const labelEl = document.querySelector(`label[for="${el.id}"]`);
                if (labelEl) labelText = (labelEl as HTMLElement).innerText;
              } else {
                if(el.parentElement) labelText = el.parentElement.innerText.replace(el.value, '').trim().substring(0, 50);
              }

              // 2. Options (for Select / Radio)
              let options: { label: string; value: string }[] | undefined = undefined;
              if (el.tagName === 'SELECT') {
                  options = Array.from(el.options).map((opt: any) => ({
                    label: opt.innerText,
                    value: opt.value
                  }));
              }

              // 3. Selector Strategy
              let selector = el.tagName.toLowerCase();
              if (el.id) selector += `#${el.id}`;
              else if (el.name) selector += `[name="${el.name}"]`;

              return {
                id: el.id,
                name: el.name,
                type: el.type,
                label: labelText.trim(),
                options,
                section: getContext(el),
                selector
              };
            });
          }
        }, (results) => {
          setScanning(false);
          if (results && results[0] && results[0].result) {
            const fields = results[0].result as SkeletonField[];
            const uniqueFields = fields.filter((f, index, self) => 
              index === self.findIndex((t) => (
                t.selector === f.selector
              ))
            );
            setSkeleton(uniqueFields);
          }
        });
      }
    });
  };

  const handleAiMap = async () => {
    setMapping(true);
    try {
      const response = await fetch('http://localhost:3001/api/ext/ai-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skeleton })
      });

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      console.log("AI Map Received:", data);
      
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (!activeTab?.url) {
        throw new Error("Could not determine active tab URL");
      }

      const url = new URL(activeTab.url);
      const key = url.protocol === 'file:' ? url.pathname : url.hostname;
      
      console.log(`Saving map for key: map_${key}`);
      await chrome.storage.local.set({ [`map_${key}`]: data });
      
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const exportUrl = URL.createObjectURL(blob);
      chrome.tabs.create({ url: exportUrl });
      
      alert(`AI Mapping Saved locally for this site! You can now use "Auto-Fill".`);

    } catch (e) {
      console.error(e);
      alert("Error calling AI Mapping API. Ensure localhost:3001 is running.");
    } finally {
      setMapping(false);
    }
  };

  const handleExport = () => {
    const json = JSON.stringify({ skeleton }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    chrome.tabs.create({ url });
  };

  return (
    <div className="mapper-container" style={{ padding: '16px', background: '#f5f3ff', borderBottom: '2px solid #7c3aed' }}>
      <h3 style={{color: '#5b21b6'}}>🔮 AI Mapper</h3>
      <p style={{fontSize: '12px', color: '#666'}}>
        1. Scan DOM {'->'} Skeleton<br/>
        2. Send to AI {'->'} Smart Map
      </p>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={handleScan} disabled={scanning} style={{flex: 1}}>
          {scanning ? 'Scanning...' : '1. Scan Page'}
        </button>
        {skeleton.length > 0 && (
          <button onClick={handleAiMap} disabled={mapping} style={{flex: 1, background: '#7c3aed', color: 'white'}}>
            {mapping ? 'Thinking...' : '2. Ask AI'}
          </button>
        )}
      </div>

      <div className="scan-results" style={{ overflowY: 'auto', maxHeight: '400px' }}>
        {skeleton.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
            Click "Scan Page" to build the Semantic Skeleton.
          </p>
        ) : (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
               <strong>{skeleton.length} Fields Found</strong>
               <button onClick={handleExport} style={{fontSize: '10px', padding: '2px 6px'}}>Save JSON</button>
            </div>
            {skeleton.map((field, idx) => (
              <div key={idx} style={{ 
                marginBottom: '8px', 
                padding: '8px', 
                background: 'white', 
                borderLeft: '3px solid #ddd',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}>
                <div style={{color: '#7c3aed', fontWeight: 'bold'}}>{field.section}</div>
                <div style={{fontSize: '12px', fontWeight: 'bold', margin: '4px 0'}}>{field.label}</div>
                <div style={{color: '#666'}}>{field.selector}</div>
                {field.options && (
                  <div style={{fontSize: '10px', color: '#999', marginTop: '2px'}}>
                    Options: {field.options.slice(0,3).map(o => o.label).join(', ')}...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
