# Real-World Integration Strategy: MHT CET 2026
## Moving from Mock to Live

### 1. The Challenge
The current "Mock Portal" uses simple, clean HTML (e.g., `<input name="CandidateName">`). Real exam portals (often built on ASP.NET WebForms or Java/JSP) use complex, nested structures with dynamic IDs and strict validation.

**Goal:** Make the Extension work on `https://cetcell.mahacet.org/` (and its sub-domains).

### 2. Gap Analysis

| Feature | Mock Portal | Real Portal (Expected) | Solution |
| :--- | :--- | :--- | :--- |
| **Selectors** | Simple `name="Gender"` | Complex `#ctl00_cp_txtGender` or dynamic hashes. | Use **Robust Selectors** (Label matching, Attribute substring matching). |
| **Events** | Standard HTML events. | Framework-specific (React/Angular) or Server-side validation triggers. | Enhanced `FormFiller` with full event sequence (`focus`, `input`, `change`, `blur`). |
| **Navigation** | Single Page. | Multi-step Wizard (Step 1: Reg, Step 2: Personal, Step 3: Photo). | **State-Aware Adapter** that detects the current "Step" via URL or DOM cues. |
| **Captcha** | None. | Image/Text Captcha. | Skip Captcha fields; auto-focus them for user. |

### 3. Execution Plan

#### 3.1 Reverse Engineering (The "Inspector")
Since we cannot browse the live site, we need to gather intelligence.
- **Task:** Create a "Dev Mode" in the extension that logs the details of the active page's form fields (IDs, Names, Labels) to the console when clicked.
- **Action:** User (Developer) navigates to the real MHT CET Registration page, clicks "Inspect Page" in the extension, and sends us the log.

#### 3.2 Robust Selector Strategy
Instead of relying on unstable IDs, we will use **Heuristic Matching**:
1.  **Label Matching:** Find the `<label>Father Name</label>`, then find the associated `<input>`.
2.  **Attribute Matching:** `input[id*="CandidateName"]` (contains "CandidateName").
3.  **Hierarchy:** `div.personal-details input[type="text"]:nth-of-type(1)`.

#### 3.3 Event Simulation Upgrade
Real portals often "reset" values if the user doesn't physically type.
**Upgrade:** The `FormFiller` must simulate a "human-like" interaction:
```javascript
function simulateType(element, value) {
  element.focus();
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.blur();
}
```

#### 3.4 Multi-Step Support
The MHT CET application is likely a wizard.
- **Step 1:** Registration (Name, Email, Mobile).
- **Step 2:** Profile (Parents, Category, Domicile).
- **Step 3:** Address.
- **Step 4:** Photo/Sign.

The Adapter must check `window.location.href` or specific page headings ("Step 2 of 4") to decide *which* subset of data to inject.

### 4. Implementation Tasks (Extended Milestone 2)

- [ ] **M2.5 (Inspector):** Add "Log Form Details" button to Side Panel (Dev only).
- [ ] **M2.6 (Heuristics):** Implement `FormFiller.findByLabel(labelText)` utility.
- [ ] **M2.7 (Events):** Upgrade `dispatchEvents` to handle ASP.NET/Angular quirks.
- [ ] **M2.8 (Live Mapping):** Update `mhtCet.ts` with real-world selectors (once obtained).
