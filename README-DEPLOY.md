# UniApply Production Deployment Guide

## 1. Prerequisites
- **GitHub Repository:** Ensure all code is pushed to `main`.
- **Vercel Account:** For hosting the Web App.
- **Database:** A production Postgres/MySQL database (e.g., Supabase, Neon, or Vercel Postgres). Currently using SQLite (dev only).

## 2. Database Migration (Supabase PostgreSQL)
*Note: SQLite does not work on Vercel. We use Supabase.*

1.  **Create Project:** Go to [database.new](https://database.new) and create a new project.
2.  **Get Connection String:**
    *   Go to Project Settings -> Database -> Connection String -> URI.
    *   Copy the **Transaction Mode** string (port 6543) for best performance with Vercel.
3.  **Update Config:**
    *   In `web/prisma/schema.prisma`:
        ```prisma
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
          directUrl = env("DIRECT_URL") // Optional: For migrations
        }
        ```
    *   In `web/.env`:
        ```
        DATABASE_URL="postgres://postgres.xxxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
        DIRECT_URL="postgres://postgres.xxxx:password@aws-0-region.supabase.com:5432/postgres"
        ```
4.  **Deploy Schema:**
    ```bash
    npx prisma migrate dev --name init_supabase
    ```
5.  **Seed Data:**
    ```bash
    npx prisma db seed
    ```

## 3. Web App Deployment (Vercel)
1.  Import the repo on Vercel.
2.  Set Environment Variables:
    - `DATABASE_URL`: Your production Postgres URL.
    - `GEMINI_API_KEY`: Your AI Key.
    - `NEXTAUTH_SECRET`: Generate a random string.
3.  Deploy!

## 4. Extension Deployment
1.  Navigate to `extension/`.
2.  Run `npm run build`.
3.  The `dist/` folder is your artifact.
4.  **Chrome Web Store:**
    - Zip the `dist/` folder.
    - Upload to Developer Dashboard.
    - Pay the $5 fee (one time).
    - Submit for review.

## 5. Domain Setup
- Point `uniapply.in` (or your domain) to Vercel Nameservers.
