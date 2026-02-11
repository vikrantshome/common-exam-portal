# Data Seeding Strategy

## Objective
Populate the production database with accurate, verified exam data from `doc/exams/`.

## Data Sources
*   `doc/exams/*.md`: Contains exam details (Name, Dates, URL, Eligibility).
*   `doc/master/references/Open_Registrations_2026.md`: Contains Status.

## Seeding Script (`prisma/seed.ts`)
We will create a script that:
1.  Reads the list of Exams.
2.  Upserts them into the `Exam` table using the `code` as a unique key.

### Exam Data Mapping

| Code | Name | Reg Start | Reg End | URL |
| :--- | :--- | :--- | :--- | :--- |
| `JEE_MAIN` | JEE Main 2026 | 2025-11-01 | 2025-12-01 | `jeemain.nta.ac.in` |
| `NEET` | NEET UG 2026 | 2026-02-09 | 2026-03-09 | `exams.nta.ac.in/NEET` |
| `MHT_CET` | MHT CET 2026 | 2026-01-16 | 2026-03-01 | `cetcell.mahacet.org` |
| `BITSAT` | BITSAT 2026 | 2026-01-15 | 2026-04-11 | `bitsadmission.com` |
| `VITEEE` | VITEEE 2026 | 2025-11-01 | 2026-03-31 | `vit.ac.in` |
| `SRMJEEE` | SRMJEEE 2026 | 2025-11-01 | 2026-04-15 | `srmist.edu.in` |
| `KCET` | KCET 2026 | 2026-01-10 | 2026-02-20 | `cetonline.karnataka.gov.in` |
| `GUJCET` | GUJCET 2026 | 2026-01-25 | 2026-02-25 | `gseb.org` |
| `WBJEE` | WBJEE 2026 | 2025-12-28 | 2026-02-05 | `wbjeeb.nic.in` |

*Note: Dates are approximate based on 2026 trends. The seeder should use ISO-8601 strings.*

## Execution
Run `npx prisma db seed` before production deployment.
