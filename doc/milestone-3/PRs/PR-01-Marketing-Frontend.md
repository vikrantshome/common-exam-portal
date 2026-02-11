# PR 01: Marketing & Landing Page (Milestone 3)

## 🎯 Objective
Launch a professional, trustworthy public face for UniApply India to convert visitors into users.

## 🛠 Key Changes

### 1. Landing Page (`web/src/app/page.tsx`)
- **Hero Section:** High-conversion copy ("Don't Type. Just Apply") with clear CTAs.
- **Features Section:** Highlights Auto-Fill, Privacy, and Exam Support.
- **Navbar & Footer:** Fully responsive navigation structure (Pricing removed).

### 2. Exam Directory (`web/src/app/exams/`)
- **Directory Page:** Lists all supported exams dynamically fetched from the database.
- **Detail Pages (`[id]`):** SEO-optimized pages for each exam with Registration Dates, Links, and "How to Apply" guides.
- **Metadata:** Dynamic `generateMetadata` for rich social sharing and SEO.

### 3. SEO Infrastructure
- `sitemap.ts`: Auto-generates `sitemap.xml`.
- `robots.ts`: Configures crawling rules.

## ✅ Verification
- [x] Landing page is responsive and links work.
- [x] Exam Directory lists exams from DB.
- [x] Detail pages load correct data.
- [x] Sitemap is generated.
