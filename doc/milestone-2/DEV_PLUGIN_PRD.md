# Product Requirements Document: UniApply Mapper (Dev Tool)
## Milestone 2 Extension - Developer Edition

### 1. Objective
Create a specialized internal browser extension ("UniApply Mapper") to accelerate the reverse-engineering of exam portals. It allows developers to "map" a live exam website page-by-page and export a structured configuration file (JSON) that drives the Client Extension.

### 2. Core Features

#### 2.1 Page Inspector (The "Scanner")
- **Auto-Detection:** When activated, scan the DOM for all inputs, selects, and textareas.
- **Smart Guessing:** Heuristically match fields to UniApply Profile keys based on `name`, `id`, `label`, or `placeholder`.
  - *Example:* If `name="candidate_mobile"`, suggest mapping to `user.mobile`.
- **Manual Override:** Allow the developer to correct the mapping via a UI popup (e.g., select "Mother's Name" from a dropdown for field `#txtMother`).

#### 2.2 Navigation Recorder
- **URL Capture:** Record the exact URL pattern for the current step (e.g., `*://*/Registration/PersonalDetails.aspx`).
- **Step Tagging:** Label the current page (e.g., "Step 1: Registration").

#### 2.3 JSON Export
- Generate a `SiteMap` JSON object compatible with the Client Extension's engine.
- Structure:
```json
{
  "exam": "MHT_CET",
  "steps": [
    {
      "name": "Personal Details",
      "urlMatch": "/PersonalDetails",
      "fields": [
        { "domSelector": "#txtName", "profileKey": "firstName" },
        { "domSelector": "#ddlCategory", "profileKey": "category" }
      ]
    }
  ]
}
```

### 3. Workflow
1.  Dev installs "UniApply Mapper".
2.  Dev opens MHT CET portal -> "Step 1".
3.  Dev clicks "Map This Page".
4.  Extension highlights fields and suggests mappings.
5.  Dev approves/edits and clicks "Save Step".
6.  Dev navigates to "Step 2".
7.  Repeat.
8.  Dev clicks "Export Full Map".

### 4. Technical Stack
- **Base:** Fork of the current Extension scaffold.
- **Permission:** `<all_urls>` (Strictly Dev only).
- **Storage:** `chrome.storage.local` to hold the multi-step map in progress.
