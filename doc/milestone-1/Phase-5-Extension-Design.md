# Phase 5: Browser Extension Design Document
## Project: UniApply Smart Form Assistant

### 1. Overview
The "UniApply Smart Form Assistant" is a Chrome/Edge extension that acts as a co-pilot for students filling out exam applications (e.g., JEE Main, NEET). It connects to the student's UniApply Master Profile and intelligently auto-fills fields on external websites, saving time and reducing errors.

**Core Philosophy:** "The student stays in control; the extension assists."

### 2. Architecture

The system follows a 3-part architecture:

1.  **UniApply Web App (The Source):** 
    - Holds the Master Profile data.
    - Exposes a secure API endpoint `GET /api/user/profile` (protected by session cookie or token).
2.  **Browser Extension (The Bridge):**
    - **Side Panel / Popup:** UI for the user to log in (or verify session) and select which profile to use.
    - **Background Service Worker:** Orchestrates communication between the Side Panel and Content Scripts.
    - **Content Scripts:** JavaScript injected into the *target* exam website (e.g., `jeemain.nta.ac.in`) to manipulate the DOM.
3.  **Target Exam Portal (The Destination):**
    - The third-party website where the form is being filled.

### 3. Key Components

#### 3.1 Manifest V3 Configuration
- **Permissions:** 
  - `activeTab`: To read/write to the current page.
  - `storage`: To save local preferences.
  - `sidePanel`: For the assistant UI.
  - `scripting`: To inject logic dynamically.
- **Host Permissions:** 
  - `*://*.jeemain.nta.ac.in/*`, `*://*.neet.nta.nic.in/*` (Target sites).
  - `http://localhost:3000/*` (or production URL) for auth checks.

#### 3.2 Side Panel (The "Remote Control")
- **State 1: Unauthenticated:** Shows a "Login to UniApply" button. Opens the Web App in a new tab.
- **State 2: Ready:** Shows "Profile Found: [Student Name]" and a big "Auto-Fill This Page" button.
- **State 3: Filling:** Shows progress (e.g., "Filling 12/40 fields...").
- **State 4: Report:** Shows a summary ("Success: 35, Pending: 5").

#### 3.3 Site Adapters (The "Intelligence")
Instead of generic logic, we use specific adapters for each exam to ensure high accuracy.

**Example Adapter Structure (`adapters/jee-main.js`):**
```javascript
export const jeeMainAdapter = {
  urlPattern: "jeemain.nta.ac.in",
  fields: {
    "candidateName": { selector: "#txtCandidateName", source: "firstName + lastName" },
    "fatherName": { selector: "#txtFatherName", source: "fatherName" },
    "dobDay": { selector: "select[name='day']", source: "dob.day" },
    // ...
  }
}
```

#### 3.4 Content Script Logic
1.  **Listen:** Waits for a message from the Side Panel.
2.  **Match:** Identifies which adapter applies to the current URL.
3.  **Inject:** 
    - Finds elements using the adapter's selectors.
    - Sets the value (handling standard Inputs, Selects, Radio buttons).
    - Dispatches `input` and `change` events (crucial for React/Angular forms to detect changes).
4.  **Highlight:** 
    - **Green Border:** Successfully filled.
    - **Yellow Border:** Data missing in Master Profile.
    - **Red Border:** Field found but failed to fill (mismatch).

### 4. Security & Data Flow

1.  **Auth Handshake:**
    - The extension does *not* ask for username/password.
    - It checks for the `session` cookie from the UniApply Web App domain.
    - If valid, it requests the profile data via `fetch('https://uniapply.com/api/profile')`.
2.  **Data Storage:**
    - Profile data is cached in `chrome.storage.local` (encrypted if possible) for the session duration.
    - Cleared on browser close or logout.
3.  **Privacy:**
    - The extension only runs on whitelisted exam domains.
    - It never sends data *from* the exam portal back to our servers (read-only for filling).

### 5. Implementation Plan (WBS)

#### Phase 5.1: Extension Scaffold
- [ ] Initialize `manifest.json` (V3).
- [ ] Set up a Vite/React build process for the extension (distinct from the Web App).
- [ ] Create the Side Panel UI shell.

#### Phase 5.2: Communication Bridge
- [ ] Implement `background.ts` to handle messages.
- [ ] Implement Auth Check: logic to query the Web App for the current user session.
- [ ] Create an API Route in Next.js (`/api/ext/profile`) specifically for the extension to fetch clean JSON data.

#### Phase 5.3: The Injection Engine
- [ ] Build the `FormFiller` class:
    - `.fillInput(selector, value)`
    - `.fillSelect(selector, value)`
    - `.fillRadio(name, value)`
- [ ] Implement Event Dispatching (to trigger validation on target sites).

#### Phase 5.4: Adapter Creation (The "Mappings")
- [ ] Create `jee-main-2026.json` mapping.
- [ ] Create `dummy-form.json` for local testing.

#### Phase 5.5: Testing
- [ ] Create a local HTML "Dummy Exam Portal" with typical weird field names.
- [ ] Verify auto-fill works on the dummy portal.
- [ ] Test on live portals (if active) or archived versions.

### 6. Future Enhancements (Post-Milestone 1)
- **Document Drag-and-Drop:** Inject a floating widget on file input fields to drag photos directly from the Vault.
- **CAPTCHA Solver:** Integration with 3rd party solving APIs (optional).
- **Payment Helper:** Auto-fill UPI VPA or Card details (stored securely).
