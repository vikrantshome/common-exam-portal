# Exam Data Requirements & Master Profile Schema

## 1. Exam-Specific Requirements (2025-2026 Cycle)

### 1.1 JEE Main
- **Personal:** Name, Parents' Names, DOB, Gender, Nationality, State of Eligibility, Category, PwD status.
- **Academic:** Class 10 & 12 details (Board, Year, Roll No, School Name, Marks).
- **Documents:**
  - Photo (10-200KB, JPG)
  - Signature (4-30KB, JPG)
  - Category Certificate (50-300KB, PDF)
  - PwD Certificate (if applicable)
  - Class 10 Certificate (for DOB)
- **Specifics:** Aadhar Number is heavily preferred.

### 1.2 MHT CET (Maharashtra)
- **Personal:** Domicile is critical (Maharashtra/OMS).
- **Documents:**
  - Photo (15-50KB, JPG)
  - Signature (5-20KB, JPG)
  - Domicile Certificate (Critical)
  - Caste/Category Certificate
  - Non-Creamy Layer Certificate (for OBC/SBC/VJ/DT/NT)
- **Specifics:** MHT CET often requires specific "Type of Candidature" selection based on domicile rules.

### 1.3 VITEEE (VIT)
- **Documents:**
  - Photo (10-200KB, JPG)
  - Signature (10-200KB, JPG)
- **Specifics:** Simpler form. Focus on "Ni-X" (NRI vs Indian) status.

### 1.4 BITSAT (BITS Pilani)
- **Academic:** Detailed subject-wise marks preference (PCM/PCB).
- **Documents:**
  - Photo (50-100KB, JPG) - *Note larger minimum size*
  - Signature (10-50KB, JPG)
- **Specifics:** Allows choosing exam centers in Dubai.

### 1.5 KCET (Karnataka)
- **Documents:**
  - **Left Thumb Impression** (Unique requirement).
  - Study Certificate (from Karnataka schools, signed by BEO).
  - Kannada Medium Certificate (if applicable).
  - Rural Study Certificate (if applicable).
- **Specifics:** Heavily document-verification focused post-exam, but specific "Claim Codes" are needed during application.

### 1.6 AP EAPCET (Andhra Pradesh)
- **Personal:** Local Status (OU/AU/SVU/Non-local).
- **Documents:** Photo (<30KB), Signature (<15KB).
- **Specifics:** Ration Card Number often requested.

### 1.7 SRMJEEE, KIITEE, GUJCET
- Standard fields similar to JEE Main.
- **GUJCET:** School Index Number (specific to Gujarat Board schools).

### 1.8 CUET (UG)
- **Documents:** Photo (10-200KB), Signature (4-30KB), Category Cert (50-300KB).
- **Specifics:** Domain Subject selection is complex and vital.

---

## 2. Consolidated "Master Profile" Schema

To cover 95% of the above without asking for redundant data, our **Universal Profile** must capture:

### A. Student Identity (KYC)
- Full Name (as per Class 10)
- Gender
- Date of Birth
- Aadhar Number
- Nationality
- Domicile State (Crucial for State CETs)
- Category (Gen/EWS/OBC-NCL/SC/ST)
- Sub-Category (PwD, Kashmiri Migrant)

### B. Contact Information
- Mobile Number (Primary & Parent's)
- Email ID
- Permanent Address (Line 1, 2, City, State, Pin Code)
- Correspondence Address (Checkbox "Same as Permanent")

### C. Family Details
- Father's Name, Occupation, Annual Income
- Mother's Name, Occupation, Annual Income

### D. Academic History
- **Class 10:** Board, School Name, Year of Passing, Roll/Reg No, Percentage/CGPA, Upload Marksheet.
- **Class 12:** Board, School Name, Status (Appearing/Passed), Year, Roll No, School Address.
  - *Conditional:* If Passed -> Aggregate Marks, PCM/PCB Marks.

### E. Document Vault (Smart Resizer)
The system must store high-res versions and auto-generate these variants:
1.  **Photograph:**
    - Variant A: 10-200KB (JEE/Standard)
    - Variant B: 50-100KB (BITSAT style)
    - Variant C: <30KB (State CETs)
2.  **Signature:**
    - Variant A: 4-30KB
    - Variant B: 10-50KB
3.  **Thumb Impression (Left):** Required for KCET.
4.  **Certificates (PDF):**
    - Class 10 Marksheet
    - Category Certificate
    - Domicile Certificate (Crucial for State quotas)
    - Income Certificate (for EWS)

### F. Exam-Specific Extras (Optional Add-ons)
- "Have you studied in Rural Area?" (KCET)
- "Ration Card Number" (AP EAPCET)
- "School Index No" (GUJCET)
