# Technical Specification - Milestone 3

## 1. Architecture Overhaul
No major architectural changes, but significant **optimization**.

### 1.1 Web App (Next.js)
*   **Routing:** Switch Dashboard to **Layout Groups** (`(dashboard)`) to ensure persistent navigation state.
*   **Styling:** Enforce **Tailwind CSS** with `shadcn/ui` components.
    *   Add `framer-motion` for page transitions (Smooth feel).
    *   Use `lucide-react` for consistent iconography.
*   **Performance:**
    *   Enable `next/image` optimization.
    *   Lazy load heavy dashboard charts.

### 1.2 Extension (React/Vite)
*   **Build Process:**
    *   Minify JS/CSS.
    *   Remove `console.log` via Vite/Rollup plugins (`terser`).
*   **State Management:**
    *   Use `Zustand` or React Context for managing "Auto-fill Status" (Idle, Scanning, Filling, Success, Error).
*   **Communication:**
    *   Secure `window.postMessage` channel between Content Script and Injected UI.

## 2. Security Enhancements
*   **Content Security Policy (CSP):** Tighten extension CSP.
*   **Data Sanitization:** Zod validation on ALL inputs (Client + Server).
*   **Rate Limiting:** On API routes (`upstash/ratelimit` or simpler in-memory map for MVP).

## 3. SEO & Metadata
*   **Metadata API:** Implement dynamic `generateMetadata` for Exam pages.
*   **Sitemap:** Generate `sitemap.xml` listing all exams.
*   **Open Graph:** Add social preview images.

## 5. Database Infrastructure
*   **Provider:** **Supabase** (Managed PostgreSQL).
*   **Connection Pooling:** Use Supabase Transaction Mode (port 6543) for serverless compatibility.
*   **ORM:** Prisma (updated to `provider = "postgresql"`).
*   **Migration:** Switch from local SQLite `dev.db` to remote Supabase instance.

