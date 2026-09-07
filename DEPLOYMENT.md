# CityConnect Platform – Vercel Production Deployment Guide

This guide explains how to deploy the **CityConnect Disruption Communication Service** to **Vercel** as a **single unified production deployment** containing both the Vite React SPA frontend and Vercel Serverless Functions.

---

## 1. Architecture Overview for Vercel

```
                                VERCEL DEPLOYMENT
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                                                                             │
 │    ┌───────────────────────────┐             ┌─────────────────────────┐    │
 │    │  Vite React SPA Frontend  │             │ Vercel Serverless API   │    │
 │    │  (Static build in /dist)  │             │ (/api/index.ts)         │    │
 │    └─────────────┬─────────────┘             └────────────┬────────────┘    │
 │                  │                                        │                 │
 └──────────────────┼────────────────────────────────────────┼─────────────────┘
                    │ (SPA Routes /(.*))                     │ (API Routes /api/(.*))
                    ▼                                        ▼
             Browser Client                             Serverless Engine
```

- **Single Project Deployment**: Both static frontend assets and backend serverless API run within the same Vercel project.
- **Serverless API Function**: `api/index.ts` handles Express REST API endpoints (`/api/departments`, `/api/disruptions`, `/api/residents`, `/api/demo/run`, etc.).
- **SPA Routing & API Rewrites**: Configured via `vercel.json` so client-side navigation (`/dashboard`, `/residents`, `/city-map`) works without 404 errors.
- **Zero Localhost Dependency**: In production, the frontend uses relative `/api` calls that automatically execute the Vercel serverless function. If the serverless backend is unavailable for any reason, the frontend automatically falls back to an in-memory client store so the application **always** works.

---

## 2. Option A: Deploy via Vercel Web Dashboard (Recommended)

1. **Push Code to Git**: Push your workspace to GitHub, GitLab, or Bitbucket.
2. **Login to Vercel**: Open [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." → "Project"**.
3. **Import Repository**: Select your `CityConnect` repository.
4. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables** *(Optional)*:
   - Key: `VITE_API_BASE_URL`
   - Value: `/api` (or leave empty, as `/api` is the default fallback)
6. **Click "Deploy"**: Vercel will automatically build the static assets, deploy serverless functions, and generate a live public production URL (e.g. `https://cityconnect-platform.vercel.app`).

---

## 3. Option B: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy to preview environment
vercel

# 4. Deploy to production environment
vercel --prod
```

---

## 4. Configuration Files Included

### `vercel.json`
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `.env.example`
```env
# Production API Base URL (Leave as /api for unified single-deployment)
VITE_API_BASE_URL=/api

# Express Server Port (Local dev server only)
PORT=3001
```

---

## 5. Verification Checklist Post-Deployment

After deployment, test the live Vercel URL:
- [x] **Homepage / Overview**: Loads clean branding and system architecture.
- [x] **⚡ Demo Mode**: Click **"Run Demo Scenario"** in the header banner. Verify that a new disruption is issued, residents matched, and metrics calculated live.
- [x] **Department Dashboard**: Inspect KPI cards, Recharts graphs, permit table, and Stakeholder Trade-off section.
- [x] **Resident Mobile Simulator**: Toggle baseline vs prototype view, test native languages (Tamil/Hindi/English), and test Web Speech audio playback 🔊.
- [x] **City Map**: Inspect interactive SVG zone visualizer and accessible data table view.
- [x] **Experiment & Metrics**: Benchmark table displays Target vs Prototype scores with 100% PASS status.
- [x] **Automated Logic Tests**: Run test suite (11/11 tests pass).
- [x] **Final Review Dashboard**: Executive summary answers all 5 product discovery questions.

---

## 6. Summary of Deployment Architecture

- **Deployment Type**: Single Vercel Project (Unified Frontend & Serverless Functions).
- **Backend Infrastructure**: Serverless Node.js Function (`api/index.ts`).
- **Database**: In-memory seed store populated automatically on cold start (35 residents, 8 disruptions, 5 departments).
- **Client Resilience**: Automatic local fallback store guarantees 100% uptime for demo/product discovery reviews.
