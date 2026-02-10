import type { UserProfile } from "../hooks/useAuth";
import { FormFiller, type SmartMap } from "../utils/formFiller";
import { DomScanner } from "../utils/domScanner";
import mhtCet2026 from "./site-maps/mht-cet-2026.json";

// The "Hardcoded" fallback registry
const STATIC_REGISTRY: Record<string, SmartMap> = {
  "mahacet.org": mhtCet2026 as SmartMap,
  "portal.maharashtracet.org": mhtCet2026 as SmartMap,
};

export const UniversalAdapter = {
  /**
   * We accept ANY URL for the Universal Adapter.
   * The actual map lookup happens in the fill() method.
   */
  matches: (url: string): boolean => {
    return url.startsWith("http") || url.startsWith("file://");
  },

  /**
   * Universal fill logic:
   * 1. Check STATIC_REGISTRY (Bundled maps)
   * 2. Check chrome.storage.local (User-generated AI maps)
   * 3. Fallback: On-Demand AI Mapping (Just-in-Time)
   */
  fill: async (user: UserProfile) => {
    const url = new URL(window.location.href);
    const hostname = url.hostname;
    const pathname = url.pathname;
    
    // Key matches what Mapper.tsx uses: hostname or pathname (for files)
    const storageKey = url.protocol === 'file:' ? pathname : hostname;
    
    console.log(`[UniversalAdapter] Attempting fill for ${storageKey}`);

    // 1. Try static bundle first
    const staticKey = Object.keys(STATIC_REGISTRY).find(key => hostname.includes(key));
    if (staticKey) {
      console.log(`[UniversalAdapter] Using bundled map for ${staticKey}`);
      FormFiller.execute(STATIC_REGISTRY[staticKey], user);
      return;
    }

    // 2. Try dynamic storage (AI generated)
    const storageData = await chrome.storage.local.get(`map_${storageKey}`);
    const cachedMap = storageData[`map_${storageKey}`];

    if (cachedMap) {
      console.log(`[UniversalAdapter] Using cached AI map from storage for ${storageKey}`);
      FormFiller.execute(cachedMap as SmartMap, user);
      return;
    } 
    
    // 3. Just-in-Time AI Mapping (The "Student Mode")
    console.log("[UniversalAdapter] No map found. Initiating Just-in-Time AI Mapping...");
    
    try {
        // A. Scan the DOM
        const skeleton = DomScanner.scan();
        console.log("[UniversalAdapter] DOM Scanned. Sending to AI...", skeleton.length, "fields");
        
        // B. Call AI API
        // NOTE: We call localhost for the pilot. In prod, this would be https://api.naviksha.com
        const response = await fetch('http://localhost:3001/api/ext/ai-map', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skeleton })
        });

        if (!response.ok) throw new Error('AI API Request Failed');
        const aiMap = await response.json();
        
        console.log("[UniversalAdapter] AI Map Generated!", aiMap);

        // C. Execute immediately
        FormFiller.execute(aiMap, user);

        // D. Cache for next time
        await chrome.storage.local.set({ [`map_${storageKey}`]: aiMap });
        console.log("[UniversalAdapter] Map cached for future use.");

    } catch (e) {
        console.error("[UniversalAdapter] AI Mapping Failed:", e);
        alert("Could not auto-map this form. Please try again or use the Mapper tool.");
    }
  }
};