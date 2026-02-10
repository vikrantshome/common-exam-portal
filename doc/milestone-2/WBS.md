# Work Breakdown Structure (WBS) - Milestone 2
## Project: UniApply Smart Form Assistant (Agentic Architecture)

### 1.0 Project Management
- [x] **1.1** Define PRD & Success Metrics (AI Pivot).
- [x] **1.2** Technical Architecture Design (Agentic Engine).
- [x] **1.3** Task Tracking & Documentation.

### 2.0 Client Extension (The Agent Body)
- **2.1 Core Scaffold**
    - [x] 2.1.1 Vite + React Setup.
    - [x] 2.1.2 Manifest V3 Configuration.
    - [x] 2.1.3 Side Panel UI.
- **2.2 Authentication Bridge**
    - [x] 2.2.1 `useAuth` Hook (Cookie/Token sync).
    - [x] 2.2.2 Profile Data Fetching.
- **2.3 Universal Adapter (The Coordinator)**
    - [x] 2.3.1 Just-in-Time Logic (Cache -> Scan -> AI -> Execute).
    - [x] 2.3.2 URL Registry Logic.

### 3.0 Vision System (The Eyes)
- **3.1 DomScanner V1 (Basic)**
    - [x] 3.1.1 Input/Select Scanning.
    - [x] 3.1.2 Label Association Heuristics.
- **3.2 DomScanner V2 (Agentic)**
    - [ ] 3.2.1 **Complex Component Detection:** `role="combobox"`, `type="hidden"`.
    - [ ] 3.2.2 **Context Mapping:** Capture parent containers and related labels.
    - [ ] 3.2.3 **Shadow DOM & Iframe Traversal** (via `all_frames: true`).

### 4.0 Runtime Engine (The Hands)
- **4.1 FormFiller V1 (Basic)**
    - [x] 4.1.1 Set Value & Dispatch Events.
    - [x] 4.1.2 Visual Highlighting.
- **4.2 Action Executor V2 (Agentic)**
    - [ ] 4.2.1 **Action Sequencer:** Execute `[CLICK, TYPE, WAIT, PRESS]`.
    - [ ] 4.2.2 **Human Simulation:** `type()` with delay.
    - [ ] 4.2.3 **Key Press Simulator:** `Enter`, `ArrowDown`.

### 5.0 Intelligence Layer (The Brain)
- **5.1 AI Backend**
    - [x] 5.1.1 Next.js API Route (`/api/ext/ai-map`).
    - [x] 5.1.2 Gemini 2.5 Flash Integration.
- **5.2 Prompt Engineering**
    - [ ] 5.2.1 **Action Planning:** Teach AI to generate sequences for React-Select.
    - [x] 5.2.2 **Composite Logic:** First+Last Name joining.
    - [x] 5.2.3 **Robustness:** JSON validation & markdown stripping.

### 6.0 Testing & Validation
- **6.1 Internal Testing**
    - [x] 6.1.1 MHT CET Mock Portal (Standard HTML).
    - [ ] 6.1.2 React-Select Test Case.
- **6.2 Real World Pilot**
    - [ ] 6.2.1 Live `mahacet.org` test.
    - [ ] 6.2.2 Performance Tuning (Latency < 3s).