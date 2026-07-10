# Production Deployment Guide - Hausly Stack

This guide details the step-by-step process for deploying the complete Hausly stack (PostgreSQL Database, NestJS Backend API, Next.js Web Portal, React Admin Dashboard, and Flutter Web Application) to cloud environments.

---

## 1. Cloud Database (Neon PostgreSQL) — ✅ Done
We have already pushed the database schema and seeded the tables with your platform's test data (Admin, Landlord, Tenant accounts, and 20 sample listing properties) to your Neon cloud database:

*   **Database Host**: `ep-autumn-sunset-ahlc3r1u.c-3.us-east-1.aws.neon.tech`
*   **Database Name**: `neondb`
*   **Username**: `neondb_owner`

---

## 2. Deploying NestJS Backend (Render or Railway)

The backend has been configured to deploy using Render's native **Node.js runtime** on the **Free Plan** to avoid any hosting costs. We created a `render.yaml` blueprint in the repository root for simple one-click deployment.

### Option A: Deploy to Render (Recommended)
1. Commit the newly added files to your repository (e.g. GitHub or GitLab).
2. Log in to [Render Console](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your repository. Render will automatically detect `render.yaml` and configure the **hausly-backend** service on the **Free tier**.
5. Fill in the required environment variables:
    *   `DATABASE_URL`: `postgresql://neondb_owner:npg_sJeF1P0QVhNq@ep-autumn-sunset-ahlc3r1u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require` (Pooled URL)
    *   `DIRECT_URL`: `postgresql://neondb_owner:npg_sJeF1P0QVhNq@ep-autumn-sunset-ahlc3r1u.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require` (Direct URL)
    *   `JWT_SECRET`: `hausly_secret_key_123` (or generate a secure random secret key)
    *   `CLOUDINARY_CLOUD_NAME`: *your-cloudinary-cloud-name*
    *   `CLOUDINARY_API_KEY`: *your-cloudinary-api-key*
    *   `CLOUDINARY_API_SECRET`: *your-cloudinary-api-secret*
    *   `GOOGLE_MAPS_API_KEY`: *your-google-maps-api-key*
6. Deploy. Render will build the Docker container and give you a public HTTPS URL (e.g. `https://hausly-backend.onrender.com`).

---

## 3. Deploying Frontends (Vercel)

Since your system has the **Vercel CLI** installed and logged in, you can deploy the frontends directly from your local terminal.

> [!IMPORTANT]
> Keep your **Backend URL** (from Step 2) ready before starting. We will refer to it as `https://hausly-backend.onrender.com`.

### A. Next.js Web Portal (`web` folder)
The web portal will be deployed as a Next.js App.
1. Open your terminal in the `web` directory:
   ```bash
   cd web
   ```
2. Run the Vercel deploy command (use `vercel.cmd` since script execution is bypassed):
   ```bash
   vercel.cmd --prod
   ```
3. Follow the prompts to initialize the project (select defaults).
4. Go to your Vercel Dashboard for the newly created project:
    *   Add an Environment Variable: `NEXT_PUBLIC_API_URL` set to `https://hausly-backend.onrender.com`.
5. Redeploy (or run `vercel.cmd --prod` again) to apply the environment variables at build-time.

### B. Vite Admin Dashboard (`admin` folder)
The admin panel is compiled to a static Single Page Application (SPA). We created a `vercel.json` rewrite file to prevent 404 errors when refreshing sub-pages.
1. Open your terminal in the `admin` directory:
   ```bash
   cd admin
   ```
2. Set your build environment variable for Vite:
   *   On PowerShell: `$env:VITE_API_URL="https://hausly-backend.onrender.com"`
   *   On Command Prompt: `set VITE_API_URL=https://hausly-backend.onrender.com`
3. Compile the Vite build:
   ```bash
   npm.cmd run build
   ```
4. Deploy the build output to Vercel:
   ```bash
   vercel.cmd --prod
   ```
   *(Select `dist` as the directory to deploy when prompted, or configure Vercel to point to it).*

### C. Flutter Web App (`frontend` folder)
The Flutter mobile application has been built for the Web and compiles to a static web directory. We added a rewrite configuration `vercel.json` inside the build output to support routing.
1. Clean and compile the Flutter project for Web, injecting your Backend URL at build-time:
   ```bash
   cd frontend
   flutter build web --release --dart-define=BACKEND_URL=https://hausly-backend.onrender.com
   ```
2. Deploy the built static web output folder to Vercel:
   ```bash
   cd build/web
   vercel.cmd --prod
   ```
   *(Select defaults to deploy the folder directly as static web assets).*

---

## 4. Endpoints Check
Once all services are online, verify your users can access:
*   **Next.js Marketplace Portal**: `https://hausly-web.vercel.app`
*   **Admin Dashboard**: `https://hausly-admin.vercel.app`
*   **Flutter Web Client**: `https://hausly-app.vercel.app`
