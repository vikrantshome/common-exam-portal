# Product Requirements Document (PRD) - Milestone 2
## Project: UniApply Smart Form Assistant (Agentic Form Engine)

### 1. Objective
Develop a **Universal, Agentic Form Engine** capable of mapping and filling highly complex, dynamic web forms (including React, Angular, Shadow DOM, and Custom UI libraries) without site-specific hardcoding.

### 2. The Paradigm Shift: "Agentic Architecture"
Moving beyond simple selector mapping to **Intelligent Interaction Plans**.
- **Old Way:** "Field X is `#gender`. Set value to 'M'." (Fails on React-Select).
- **New Way:** "Field X is a Complex Dropdown. To fill it: Click `#gender .control`, Type 'Male', Press Enter."

### 3. Functional Requirements

#### 3.1 The Vision Agent (DomScanner 2.0)
- **Deep Scanning:** Detects not just standard inputs, but also:
  - `role="combobox"` (React-Select, Headless UI).
  - `type="hidden"` inputs paired with interactive containers.
  - Shadow DOM roots (optional).
  - ARIA-labelled interactive `div`/`span` elements.
- **Context Capture:** Captures the *structure* of a control (Container, Label, Input, Interactive Element) to give the AI full context.

#### 3.2 The Brain (AI Engine)
- **Action Planning:** Generates an **Execution Plan** (JSON) instead of a simple flat map.
- **Dynamic Reasoning:** Decides *how* to interact with a field based on its structure (e.g., "This looks like React-Select, so I need to simulate typing").
- **Composite Logic:** intelligently combines multiple data points (First+Last Name) when needed.

#### 3.3 The Runtime Agent (Action Executor)
- **Instruction Interpreter:** Executes a sequence of low-level DOM actions:
  - `click(selector)`
  - `type(selector, text, speed)`
  - `pressKey(selector, key)`
  - `wait(ms)`
- **Feedback Loop:** Verifies if the action succeeded (e.g., did the value change? did the error disappear?).

### 4. Technical Architecture

#### 4.1 System Components
1.  **`DomScanner.ts`**: The "Eyes". Extracts a Rich Semantic Skeleton.
2.  **`api/ext/ai-map`**: The "Brain". Uses Gemini 2.5 to generate the Smart Map (Action Plan).
3.  **`FormFiller.ts`**: The "Hands". A robust engine that executes the Action Plan.
4.  **`UniversalAdapter.ts`**: The "Coordinator". Manages the workflow (Scan -> Plan -> Execute).

#### 4.2 Data Flow (Just-in-Time)
1.  **User** clicks "Auto-Fill".
2.  **Adapter** checks Local Storage.
3.  **If Missing:**
    - `DomScanner` analyzes the page structure.
    - Sends Skeleton to API.
    - API returns `SmartMap` (with Action Sequences).
    - `FormFiller` executes the sequence.
    - Map is cached.

### 5. Success Metrics
- **Complexity Support:** Successfully fills the MHT CET "React-Select" Dropdowns.
- **Universality:** Works on at least 3 distinct form types (Standard HTML, React-Select, Material UI) without code changes.
- **Reliability:** >90% Field Fill Rate on complex forms.
