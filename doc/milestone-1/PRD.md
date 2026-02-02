# Product Requirements Document (PRD) - Milestone 1
## Project: Common Exam Registration Portal (UniApply India)

### 1. Introduction
The Common Exam Registration Portal aims to simplify the chaotic application process for Indian Class 12 students. Instead of filling out redundant information across multiple websites (JEE, NEET, BITSAT, etc.), students will fill out one "Master Form" and use a **Browser Plugin** to auto-fill applications on official exam portals.

### 2. Milestone 1 Objective: "The Universal Profile & Dashboard"
The goal of Milestone 1 is to build the foundational architecture where a student can create an account, fill out their comprehensive "Master Profile" (data required by 90% of exams), and view a list of available exams.

**Key Value Proposition:** "Enter your data once, use it everywhere."

### 3. Target Audience
- Indian Students currently in Class 12 or passed Class 12 .
- Parents assisting their children with the application process.

### 4. Functional Requirements

#### 4.1 User Authentication
- **Sign Up/Login:** Mobile number or Student ID based login 
- **Onboarding:** Basic distinct inputs (Stream: PCM/PCB/PCMB).

#### 4.2 The "Master Form" (Universal Profile)
This is the core engine. It must capture data fields common to major exams.
- **Personal Details:** Name, DOB, Gender, Category (Gen/OBC/SC/ST), Aadhar Number, Father's/Mother's Name, Occupation, Income.
- **Contact Details:** Permanent Address, Correspondence Address, Mobile, Email.
- **Academic Details:**
  - Class 10: Board, School Name, CGPA/Percentage, Year of Passing, Roll No.
  - Class 12: Board, School Name, Status (Appearing/Passed), Subjects, Marks (if available).
- **Document Vault:**
  - Upload Scanned Photograph (Passport size).
  - Upload Signature.
  - Upload Category Certificate (if applicable).
  - Upload ID Proof (Aadhar/Passport).
  *Requirement:* Auto-resize/compress tools to meet different exam strict size limits (e.g., JEE needs 10-200kb, NEET needs similar).

#### 4.3 Exam Discovery (Static Database)
- List of supported exams: JEE Main, NEET, MHT CET, BITSAT, VITEE.
- **Exam Details Page:**
  - Registration Dates (Start/End).
  - Exam Date.
  - Eligibility Criteria.
  - Application Fee.
  - Official Website Link.

#### 4.4 Student Dashboard
- Status overview: Profile Completion %.
- List of "Upcoming Deadlines" for exams.
- "My Applications" section (Empty for M1, but UI placeholder needed).

#### 4.5 Smart Form Assistant Plugin (Browser Extension)
- **Plugin Development:** Develop a Chrome/Edge extension that acts as a "Sidekick" on official exam websites.
- **Auto-Fill Logic:** The plugin connects to the student's Master Profile and auto-populates matching fields on the target website (e.g., Name, Address, Marks).
- **Guidance & Highlighting:**
  - Visually highlight fields that were successfully filled (e.g., Green border).
  - Highlight fields that require manual input or verification (e.g., Yellow/Red border).
  - Provide a "Copy-Paste" helper for documents stored in the Vault.

### 5. Non-Functional Requirements
- **Data Security:** PII (Personally Identifiable Information) must be encrypted at rest. Compliant with Indian data privacy norms.
- **Scalability:** System should handle potential spikes during form filling.
- **UX/UI:** Mobile-responsive, but desktop-first focus for long-form filling. High accessibility.

### 6. Technical Architecture (Proposed)
- **Frontend:** React.js / Next.js (for SEO on exam pages) + Tailwind CSS.
- **Backend:** Node.js (Express) or Python (FastAPI).
- **Database:** PostgreSQL (structured relational data is crucial here).
- **Storage:** AWS S3 or compatible object storage for documents.
- **Extension:** Chrome Manifest V3 (React/HTML/JS) interacting with the Main Backend APIs.

### 7. Success Metrics for Milestone 1
- User can successfully sign up and verify email/phone.
- User can complete 100% of the Master Form fields.
- User can upload documents and view them.
- User can install the plugin and see it active on a dummy page.

### 8. Out of Scope for Milestone 1
- Payment Gateway integration.
- Admit card downloading.
