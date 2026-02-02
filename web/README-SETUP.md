# Setup & Run Guide: Common Exam Registration Portal

This guide will help you set up the project locally and manually test the key features (Milestone 1).

## Prerequisites
- **Node.js**: Version 18.x or higher.
- **npm**: Installed with Node.js.

## 1. Installation

Open your terminal and navigate to the `web` directory:

```bash
cd web
npm install
```

## 2. Database Setup

We use SQLite for local development. You need to set up the database and seed it with exam data.

1.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

2.  **Initialize Database**:
    This command will create `dev.db` and apply the schema.
    ```bash
    npx prisma migrate dev --name init
    ```

3.  **Seed Exam Data**:
    Populate the database with exams like JEE Main, NEET, etc.
    ```bash
    sqlite3 dev.db < prisma/seed.sql
    ```
    *(Note: If `sqlite3` is not installed, you can skip this, but the "Exams" page will be empty.)*

## 3. Running the Application

Start the Next.js development server:

```bash
npm run dev
```

The app will be available at: **http://localhost:3001**

## 4. Manual Testing Walkthrough

Follow these steps to verify the application flows:

### Step 1: Sign Up
1.  Go to `http://localhost:3001/signup`.
2.  Enter a Mobile Number (e.g., `9876543210`) and Password.
3.  Click **Sign Up**.
4.  *Success Check:* You should be redirected to the **Onboarding** page.

### Step 2: Onboarding
1.  Enter your **First Name** and **Last Name**.
2.  Select your **Class 12 Stream** (e.g., PCM).
3.  Click **Continue**.
4.  *Success Check:* You should land on the **Dashboard** (`/dashboard`).

### Step 3: Master Profile (Personal Details)
1.  On the Dashboard, click **"Fill Now"** next to **Personal Details** (or use the sidebar).
2.  Fill in the form (DOB, Gender, Category, Aadhar, Address).
3.  Click **Save Details**.
4.  *Success Check:* A success message "Profile updated successfully!" should appear.

### Step 4: Academic Records
1.  Navigate to **Master Profile > Academic Records**.
2.  Enter dummy data for Class 10 (e.g., CBSE, 95%) and Class 12.
3.  Click **Save Academic Records**.

### Step 5: Document Vault
1.  Navigate to **Master Profile > Documents Vault**.
2.  Upload a sample image for "Passport Photograph".
3.  *Success Check:* The file should upload, and a "View Current Upload" link should appear.

### Step 6: Browse Exams
1.  Click **Browse Exams** in the sidebar.
2.  You should see cards for **JEE Main**, **NEET UG**, etc.
3.  Click **View Details** on any exam.
4.  *Success Check:* You see the exam details (Dates, Description) and the "Apply with UniApply Plugin" placeholder.

## Troubleshooting

- **Database Errors**: If you see errors about "Table not found", run `npx prisma migrate dev` again.
- **Upload Errors**: Ensure the `public/uploads` folder exists (it is created automatically, but check permissions).
- **Login Issues**: If you get stuck, clear your browser cookies (specifically the `session` cookie) or restart the server.
