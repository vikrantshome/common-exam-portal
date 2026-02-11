# Product Requirements Document (PRD) - Milestone 3
## Project: UniApply India - Production Launch

### 1. Objective
Transform the functional MVP into a **production-grade, student-centric product**. The goal is to build trust, ensure ease of use for the target demographic (Class 12 students in India), and deliver a polished UI/UX that feels "magical" rather than "experimental".

### 2. Target Audience
- **Primary:** Indian Students (Age 16-19).
- **Traits:** Mobile-first users, high anxiety (exam stress), low tolerance for bugs, varying internet speeds.
- **Needs:** Reassurance that their data is safe, clear instructions, instant gratification.

### 3. Core Features (The "Launch" Scope)

#### 3.1 The "Front Door" (Marketing Website)
*   **Hero Landing Page:** High-conversion page explaining the value prop ("Fill once, Apply everywhere").
*   **How it Works:** Visual step-by-step guide (1. Create Profile, 2. Install Extension, 3. Auto-Fill).
*   **Exam Directory:** SEO-friendly pages listing supported exams (JEE, NEET, BITSAT, etc.) with real dates and links.
*   **Trust Signals:** "Secure & Local Storage" messaging.

#### 3.2 The "Student Dashboard" (Web App Upgrade)
*   **UI Overhaul:** Move from "Admin Panel" look to "Gamified Profile".
*   **Completion Meter:** Big, visual progress bar encouraging 100% profile completion.
*   **Mobile Responsiveness:** 100% flawless experience on mobile (where they fill the profile) vs Desktop (where they apply via Extension).

#### 3.3 The "Smart Assistant" (Extension Polish)
*   **Consumer Mode:** Remove all "Dev Mode" logs, " Inspect" buttons, and technical jargon.
*   **Visual Feedback:** Confetti or Green Checkmarks when fields are filled.
*   **Empty State:** Helpful instructions when opened on a non-supported page ("Go to a supported exam portal" link).

### 4. Data Integrity
*   **Real Data:** The database must be seeded with accurate 2026 exam data (Dates, URLs) sourced from the `doc/exams/` folder.
*   **Validation:** Profile form must have strict validation (Indian Mobile Regex, Pincode validation) to prevent errors on the actual exam forms.

### 5. Success Metrics
*   **Profile Completion Rate:** >80%.
*   **Extension Activation:** User successfully opens extension on an exam page.
*   **Page Speed:** Lighthouse score > 90.
