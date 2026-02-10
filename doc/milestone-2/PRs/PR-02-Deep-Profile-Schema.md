# PR 02: JEE Schema & Profile Updates

## 🎯 Objective
Expand the User Profile schema to support specific requirements of the JEE Mains registration form (Permanent Address, District, Country, etc.).

## 🛠 Key Changes

### 1. Database Schema (`prisma/schema.prisma`)
- **Renamed:** `address` -> `addressLine1`.
- **Added:**
    - `addressLine2` (Locality)
    - `district`
    - `country` (Default: "India")
    - `alternateMobile`
    - **Permanent Address Section:** `permAddressLine1`, `permAddressLine2`, `permCity`, `permDistrict`, `permState`, `permCountry`, `permPincode`.
    - `sameAsPresent` (Boolean flag).

### 2. Migrations
- `20260209060141_add_jee_fields`: Adds initial JEE fields.
- `20260210040926_add_perm_address`: Adds Permanent Address fields.

### 3. Server Actions & UI
- **`web/src/app/actions/profile.ts`**: Updated Zod schema and Prisma update logic to handle all new fields.
- **`web/src/components/profile/personal-details-form.tsx`**: Added UI inputs for all new fields and the "Same as Present Address" checkbox logic.
- **`web/src/lib/db.ts`**: Fixed `DATABASE_URL` resolution to correctly point to `prisma/dev.db` instead of the stale `web/dev.db`.

## ✅ Verification
- [x] Database migrations applied successfully.
- [x] Web UI allows saving/retrieving new fields.
- [x] Tested "Same As" checkbox persistence.
