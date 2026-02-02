# Work Breakdown Structure (WBS) - Milestone 1
## Project: Common Exam Registration Portal

### Phase 1: Project Initialization & Infrastructure
- **1.1 Tech Stack Setup**
  - Initialize Next.js 14+ (App Router) project with TypeScript.
  - Setup Tailwind CSS for styling.
  - Setup Shadcn/UI for accessible component primitives.
  - Configure ESLint, Prettier, and Husky for code quality.
- **1.2 Database & Backend Setup**
  - Design PostgreSQL Schema (Users, Profiles, Exams, Documents).
  - Setup Supabase (or local Postgres + Prisma/Drizzle).
  - Configure API routes / Server Actions structure.
- **1.3 Storage Setup**
  - Configure Google Drive API for document storage.
  - Implement file upload utility with size/type validation.

### Phase 2: User Authentication & Onboarding
- **2.1 Auth System**
  - Implement Login/Signup UI.
  - Simple Mobile Number / Student ID based authentication (No OTP required for MVP).
  - Secure Routes & Session Management (Middleware).
- **2.2 Onboarding Flow**
  - Create "Stream Selection" screen (PCM/PCB/PCMB).
  - Basic Profile creation (First Name, Last Name).

### Phase 3: The "Master Form" (Core Feature)
- **3.1 Form Architecture**
  - Design Multi-step Form State Management (Zustand / React Hook Form).
  - Implement Auto-save functionality (Draft mode).
- **3.2 Personal Details Module**
  - Inputs: Name, DOB, Gender, Category, Aadhar, Parents' info.
  - Validation: Regex for Aadhar, Phone, Email.
- **3.3 Academic Details Module**
  - Class 10: Board, Year, Roll No, Marks upload.
  - Class 12: Appearing/Passed toggle, Subject-wise marks input.
- **3.4 Document Vault & Resizer**
  - **Upload Component:** Drag & drop interface.
  - **Smart Resizer (Client-side):**
    - Logic to compress images to <30KB (State CETs), 10-200KB (JEE), etc.
    - Generate multiple variants from one high-res upload.
  - **Preview Mode:** View uploaded documents before submission.

### Phase 4: Exam Discovery & Dashboard
- **4.1 Exam Database (Static Content)**
  - Create JSON/Markdown data files for supported exams (Dates, Links, Fees).
  - Build "Exam Details" dynamic pages (e.g., `/exams/jee-main`).
- **4.2 Dashboard UI**
  - "Profile Completion" Progress Bar.
  - "Upcoming Deadlines" Widget (filtered by current date).
  - "My Applications" List (Placeholder for now).

### Phase 5: Browser Extension Development
- **5.1 Extension Infrastructure**
  - Initialize Manifest V3 Chrome Extension.
  - Setup background service worker and communication bridge with the Web App.
- **5.2 Content Scripts & Field Mapping**
  - Create "Site Adapters" for target portals (e.g., adapters/jee-main.js).
  - Implement logic to find input fields by ID, Name, or Label.
  - Implement "Field Highlighting" logic (Green = Filled, Yellow = Attention).
- **5.3 UI Overlay (Sidepanel/Popup)**
  - Build a React-based sidebar that injects into the target page.
  - Features: Login to UniApply, Select Profile to Apply, "Fill Form" button.

### Phase 6: Testing & Deployment
- **6.1 Quality Assurance**
  - Unit Tests for Form Validation logic.
  - E2E Tests for key flows (Signup -> Master Form -> Dashboard).
- **6.2 Deployment**
  - Deploy Frontend to Vercel.
  - Deploy Backend/Database (Supabase/Neon).
  - CI/CD Pipeline setup.

## Feature List Summary (Prioritized)
| Priority | Feature | Description |
| :--- | :--- | :--- |
| **P0** | **Master Profile Form** | The heart of the app. Captures 90% of data needed for any exam. |
| **P0** | **Document Resizer** | Auto-resizes uploaded photos/signatures to meet varied exam strictness. |
| **P0** | **Exam Dashboard** | Shows list of exams and current registration status/dates. |
| **P1** | **Mobile/ID Auth** | Simple Mobile Number or Student ID login (No OTP). |
| **P1** | **Form Assistant Plugin** | Chrome extension to auto-fill & highlight fields on exam portals. |
| **P2** | **Exam Notifications** | Email/SMS alerts for upcoming deadlines. |
