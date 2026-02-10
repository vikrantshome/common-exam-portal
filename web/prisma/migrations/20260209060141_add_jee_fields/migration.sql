/*
  Warnings:

  - You are about to drop the column `address` on the `Profile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "dob" DATETIME,
    "gender" TEXT,
    "category" TEXT,
    "aadharNo" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "district" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'India',
    "pincode" TEXT,
    "alternateMobile" TEXT,
    "class10Board" TEXT,
    "class10School" TEXT,
    "class10Percentage" REAL,
    "class10Year" INTEGER,
    "class10RollNo" TEXT,
    "class12Board" TEXT,
    "class12School" TEXT,
    "class12Status" TEXT,
    "class12Stream" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("aadharNo", "category", "city", "class10Board", "class10Percentage", "class10RollNo", "class10School", "class10Year", "class12Board", "class12School", "class12Status", "class12Stream", "createdAt", "dob", "fatherName", "firstName", "gender", "id", "lastName", "motherName", "pincode", "state", "updatedAt", "userId") SELECT "aadharNo", "category", "city", "class10Board", "class10Percentage", "class10RollNo", "class10School", "class10Year", "class12Board", "class12School", "class12Status", "class12Stream", "createdAt", "dob", "fatherName", "firstName", "gender", "id", "lastName", "motherName", "pincode", "state", "updatedAt", "userId" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
