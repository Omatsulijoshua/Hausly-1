# Hausly 🏠

A modern property marketplace stack designed to connect landlords and tenants seamlessly.

## Deployed Production Endpoints

The entire stack is live and accessible online:

*   **Tenant Web Portal (Next.js)**: [https://web-five-iota-83.vercel.app](https://web-five-iota-83.vercel.app)
*   **Admin Dashboard (Vite React)**: [https://hausly-admin.vercel.app](https://hausly-admin.vercel.app)
*   **Tenant/Landlord Web App (Flutter)**: [https://hausly-app.vercel.app](https://hausly-app.vercel.app)
*   **Backend API (NestJS)**: [https://hausly-backend-fs0v.onrender.com](https://hausly-backend-fs0v.onrender.com)
*   **PostgreSQL Cloud Database**: Hosted on [Neon](https://neon.tech/)

---

## Project Structure

This repository is a monorepo containing all components of the Hausly platform:

```
├── backend/            # NestJS API, Prisma Schema, PostgreSQL integration
├── admin/              # Vite React Admin Moderation Dashboard
├── web/                # Next.js Tenant Listings Marketplace Portal
├── frontend/           # Flutter Cross-Platform Client App (Tenant & Landlord)
└── deployment_guide.md # Step-by-step production hosting manual
```

---

## Local Development Stack

To launch the entire platform locally, open your PowerShell console in the root directory and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-hausly-stack.ps1
```

This starts all four services concurrently and outputs logs inside the `./run-logs/` folder.
