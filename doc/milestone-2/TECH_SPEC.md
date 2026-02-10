# Technical Specification - Milestone 2
## Agentic Form Engine Architecture

### 1. Core Concept: Action-Based Mapping
Instead of mapping `Data -> Selector`, we map `Data -> Interaction Sequence`.

### 2. Component Design

#### 2.1 Vision Agent (`DomScanner.ts`)
**Responsibility:** Produce a high-fidelity representation of the UI.
**Key Features:**
- **Heuristic Detection:** Identifies "Field Clusters" (e.g., a Label + Div + Hidden Input = One Dropdown).
- **Attribute Harvesting:** Captures `role`, `aria-label`, `placeholder`, `class`, and `value`.
- **Visibility Check:** Distinguishes between the "Hidden Value Holder" and the "Visible Interactive Element".

#### 2.2 Intelligence Layer (API)
**Input:** `RichSkeleton` (JSON).
**Output:** `AgenticMap` (JSON).
**Prompt Engineering:**
- Instruct AI to identify Interaction Patterns (e.g., "If `combobox`, generate a Click-Type-Enter sequence").
- Map `UniApply` data fields to these sequences.

#### 2.3 Runtime Agent (`FormFiller.ts`)
**Responsibility:** Execute the plan safely.
**Supported Actions:**
- `SET_VALUE`: Standard `input.value = x` (with event dispatch).
- `CLICK`: `element.click()`.
- `TYPE_HUMAN`: Simulate keystrokes (essential for auto-complete dropdowns).
- `KEY_PRESS`: Dispatch `keydown`, `keyup` (e.g., `Enter`, `ArrowDown`).
- `SELECT_OPTION`: Complex logic for `<select>` finding option by text.

### 3. Data Schema: The Agentic Map

```json
{
  "fields": [
    {
      "id": "gender_select",
      "source": "profile.gender",
      "logic": "REACT_SELECT", // Optional hint
      "actions": [
        {
          "type": "click",
          "selector": "#gender .css-control"
        },
        {
          "type": "type",
          "selector": "#react-select-2-input",
          "value": "{mapped_value}" // Interpolated at runtime
        },
        {
          "type": "key",
          "selector": "#react-select-2-input",
          "code": "Enter"
        }
      ],
      "mapping": { "MALE": "Male", "FEMALE": "Female" }
    }
  ]
}
```

### 4. Safety & Privacy
- **Sandbox:** Action execution happens in the isolated Content Script world.
- **Data Protection:** No user data is sent to the AI. The AI generates the *Plan* (using placeholders), and the Extension injects the *Data*.

### 5. Implementation Phases
1.  **Vision Upgrade:** Enhance `DomScanner` to see React structures.
2.  **Executor Upgrade:** Refactor `FormFiller` to run Action Sequences.
3.  **Brain Upgrade:** Update Prompt to generate Sequences.
