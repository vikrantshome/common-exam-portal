# UI/UX Guidelines - UniApply India

## 1. Design Philosophy: "Calm in Chaos"
Indian exam season is chaotic. Our app should be the antidote: Calm, Clear, and Encouraging.

## 2. Visual Identity
*   **Primary Color:** `indigo-600` (Trust, Intelligence) -> Standard Shadcn Blue.
*   **Success Color:** `emerald-500` (Growth, Correctness) -> Used for "Auto-filled" highlights.
*   **Typography:** `Inter` or `Geist Sans` (Clean, highly readable on small screens).
*   **Border Radius:** Rounded (`rounded-xl` or `rounded-2xl`) for a friendly, modern app feel.

## 3. Web App Guidelines (Mobile First)
*   **Navigation:** Bottom Tab Bar on Mobile, Sidebar on Desktop.
*   **Forms:**
    *   **Stepper Pattern:** Don't show 50 fields at once. Break into: "Personal", "Family", "Address", "Academic".
    *   **Input Size:** Large touch targets (`h-12` minimum).
    *   **Keyboards:** Force numeric keyboard for Mobile/Pincode (`inputMode="numeric"`).
    *   **Validation:** Inline, instant validation (Red border + simple text).

## 4. Landing Page Structure
*   **Navbar:** Logo + "Login" (Secondary) + "Get Extension" (Primary CTA).
*   **Hero:** 
    *   Headline: "Don't Type. Just Apply."
    *   Subhead: "The smart assistant that auto-fills your JEE, NEET, and CET forms instantly."
    *   Visual: Animation/GIF of the extension filling a form.
*   **Exam Grid:** Cards for popular exams with "Application Open" badges.

## 5. Extension Guidelines
*   **Width:** Fixed 350px-400px.
*   **Header:** Minimal. Just "UniApply" + Connection Status.
*   **Action Area:**
    *   If on Exam Page: Big "Auto-Fill" Button (Pulse animation).
    *   If not: "Go to Dashboard" button.
*   **Feedback Loop:**
    *   **Filling:** Progress bar or spinning loader.
    *   **Success:** "X Fields Filled" Toast notification.
    *   **Error:** "Could not find X" (Friendly error, not stack trace).
