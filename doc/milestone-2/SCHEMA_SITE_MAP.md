# Schema Definition: Exam Site Map
## Version 1.0

This JSON schema defines how an Exam Portal's structure is stored. The Client Extension loads this file to understand how to fill a specific website.

### Root Object
```typescript
interface ExamSiteMap {
  examCode: string;       // e.g., "MHT_CET_2026"
  displayName: string;    // e.g., "MHT CET 2026"
  domainPattern: string;  // e.g., "*.mahacet.org"
  steps: FormStep[];
}
```

### FormStep Object
Represents a single page or logical section of the application form.
```typescript
interface FormStep {
  id: string;             // Unique ID for the step (e.g., "step_personal")
  order: number;          // Sequence number (1, 2, 3)
  
  // Detection Logic
  urlPattern?: string;    // Regex or substring to match URL
  selectorMustExist?: string; // Unique element that confirms we are on this step
  
  // Actions
  fields: FieldMapping[];
}
```

### FieldMapping Object
Maps a specific DOM element to a UniApply Master Profile value.
```typescript
interface FieldMapping {
  // Target (The Exam Site)
  selector: string;       // CSS Selector (e.g., "#txtCandidateName")
  type: 'text' | 'radio' | 'select' | 'checkbox' | 'date';
  
  // Source (UniApply Profile)
  sourceKey: string;      // Dot notation path (e.g., "profile.firstName", "user.mobile")
  
  // Transformation (Optional)
  transform?: {
    type: 'map' | 'date_format' | 'combine';
    config?: any;
  };
}
```

### Example: MHT CET
```json
{
  "examCode": "MHT_CET_2026",
  "domainPattern": "mahacet.org",
  "steps": [
    {
      "id": "registration",
      "order": 1,
      "urlPattern": "/Registration/Details",
      "fields": [
        {
          "selector": "#CandidateName",
          "type": "text",
          "sourceKey": "profile.firstName",
          "transform": { "type": "combine", "config": ["firstName", "lastName"] }
        },
        {
          "selector": "input[name='Gender']",
          "type": "radio",
          "sourceKey": "profile.gender",
          "transform": {
            "type": "map",
            "config": { "MALE": "M", "FEMALE": "F" }
          }
        }
      ]
    }
  ]
}
```
