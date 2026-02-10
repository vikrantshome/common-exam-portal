# PR 01: Agentic Core Architecture (Milestone 2)

## 🎯 Objective
Implement the "Agentic Architecture" to handle complex, dynamic forms (like React-Select, Chosen, and UpdatePanels) found in Indian Exam Portals.

## 🛠 Key Changes

### 1. Vision Agent Upgrade (`DomScanner.ts`)
- **Rich UI Detection:** Now detects hidden inputs associated with libraries like **Chosen** and **Select2**.
- **Visibility Logic:** Improved `isVisible` check to allow hidden inputs if they are part of a detected Rich UI component.
- **Context Awareness:** prioritizing Modal/Dialog headers for better field labeling.

### 2. Form Filler Engine (`FormFiller.ts`)
- **Universal Delay:** Implemented a 500ms delay loop between field fills to natively handle **Cascading Dropdowns** (ASP.NET UpdatePanels) without complex AI logic.
- **Smart Date Splitting:** Logic to detect "Split Date" fields (Day/Month/Year dropdowns) and auto-distribute a single ISO date value.
- **Fuzzy Matching Refactor:**
    - **Word Boundary Awareness:** Fixed the "Female/Male" bug where searching for "Male" matched "Female".
    - **Robust Fallbacks:** Exact Match -> Text Match -> Word Boundary Regex -> Includes.

### 3. Test Mocks
- `test-portal/complex-mock.html`: Simulates React-Select.
- `test-portal/popup-mock.html`: Simulates Modals.

## ✅ Verification
- [x] Tested against MHT CET Mock.
- [x] Verified "Male/Female" distinction.
- [x] Verified State/District cascade on JEE form.
