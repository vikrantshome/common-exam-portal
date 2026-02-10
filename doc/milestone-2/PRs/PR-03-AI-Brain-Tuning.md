# PR 03: AI Brain Tuning (JEE Optimization)

## 🎯 Objective
Refine the System Prompt to handle specific edge cases found in Indian Exam Portals (specifically JEE Mains).

## 🛠 Key Changes

### 1. System Prompt Update (`web/src/app/api/ext/ai-map/route.ts`)
- **Full Name Strategy:** Explicit rule to map "Candidate's Name" to `[firstName, lastName]` instead of just `firstName`.
- **Split Date Logic:** Instruction to map all 3 date selects (Day/Month/Year) to `profile.dob` so the Filler can handle the splitting.
- **Enum Mapping:** Instruction to map Gender/Country/State directly to profile keys, relying on the Filler's new fuzzy matching.
- **Confirmation Fields:** Explicit rule to map "Confirm X" to the same source as "X".
- **Permanent Address:** Logic to click "Same As" only if the profile flag is true; otherwise map the fields.

## ✅ Verification
- [x] Verified Full Name mapping on JEE.
- [x] Verified Split Date mapping on JEE.
- [x] Verified "Confirm Gender" logic.
