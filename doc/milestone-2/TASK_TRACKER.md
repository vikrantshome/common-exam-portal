# Milestone 2 Task Tracker
## Project: UniApply Smart Form Assistant (Agentic Engine)

### 🟢 User Stories (Client)
| ID | Story | Status |
| :--- | :--- | :--- |
| **US-1** | As a student, I want to see if I'm logged in to UniApply. | `[x]` |
| **US-2** | As a student, I want to see my profile data summary. | `[x]` |
| **US-3** | As a student, I want auto-fill to work on Complex Forms (React/Angular). | `[ ]` |
| **US-4** | As a student, I want "Just-in-Time" mapping for new sites. | `[x]` |
| **US-5** | As a student, I want the scanner to focus on the active Popup/Modal if open. | `[x]` |

### 🔵 User Stories (Developer)
| ID | Story | Status |
| :--- | :--- | :--- |
| **DS-1** | As a dev, I want the scanner to detect complex UI components (React-Select). | `[x]` |
| **DS-2** | As a dev, I want the executor to run "Action Sequences" (Click/Type/Enter). | `[x]` |
| **DS-3** | As a dev, I want the scanner to ignore hidden fields and detect Modal context. | `[x]` |

---

### 🛠 Technical Tasks

#### 1. Core Infrastructure (Done)
- [x] **1.1** Client Extension Scaffold.
- [x] **1.2** Auth Bridge.
- [x] **1.3** Basic AI Mapper.
- [x] **1.4** Just-in-Time Universal Adapter.

#### 2. Agentic Architecture (New Focus)
- [x] **2.1 Vision Upgrade (`DomScanner.ts`):**
    - [x] Detect `role="combobox"` and associated labels.
    - [x] Detect `type="hidden"` inputs and find their parent containers.
    - [x] **(New)** Visibility Check & Modal Context Detection.
- [x] **2.2 Executor Upgrade (`FormFiller.ts`):**
    - [x] Implement `ActionExecutor` class.
    - [x] Support `click`, `type` (simulated), `key_press`.
- [ ] **2.3 Brain Upgrade (`api/ext/ai-map`):**
    - [ ] Update System Prompt to generate `actions` arrays. (Already in place, needs verifying)
    - [ ] Teach AI about "React-Select" patterns.

#### 3. Verification
- [x] **3.1** Test on MHT CET Mock (Standard HTML).
- [x] **3.2** Test on **Live MHT CET Portal** (Complex React UI).
- [x] **3.3** Verify "Gender" and "Category" dropdowns fill correctly.
- [x] **3.4** Verify with `test-portal/complex-mock.html`.
- [x] **3.5** Verify with `test-portal/popup-mock.html` (Visibility Logic).
- [x] **3.6** Verify JEE Mains (Date Split, Chosen Selects, Cascade Wait, Fuzzy Match).

### ✅ Milestone 2 Complete
Refined FormFiller with Universal Delay and Fuzzy Matching logic to handle complex government forms. Scanner updated to detect rich UI libraries. Schema updated for Permanent Address.
