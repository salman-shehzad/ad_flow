# AdFlow Pro

A full-stack sponsored ads marketplace with workflow moderation, payment verification, scheduling, ranking, and analytics.

## Monorepo Structure

- `client/` React + Vite + Tailwind app
- `server/` Express API with MVC-style layering and PostgreSQL
- `shared/` shared constants (roles/statuses)

## Features

- JWT authentication with RBAC (`client`, `moderator`, `admin`, `super_admin`)
- End-to-end ad workflow:
  - Draft → Submitted → Under Review → Payment Pending → Payment Submitted → Payment Verified → Scheduled → Published → Expired
- Payment verification before publishing
- Public ads only include Published non-expired records
- Ranking logic:
  - `rankScore = (featured ? 50 : 0) + (packageWeight * 10) + freshness + adminBoost`
- URL-only media handling with YouTube thumbnail extraction and fallback placeholders
- Cron jobs:
  - Hourly scheduled publish
  - Daily expiry
- Analytics API:
  - total ads
  - active ads
  - revenue by package
  - approval rate
- Seed data includes 15 sample ads

## Backend setup

```bash
cp .env.example .env
cd server
npm install
npm run migrate
npm run seed
npm run dev
```

Server runs on `http://localhost:4000`.

### Main API endpoints

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Client
  - `POST /api/client/ads`
  - `PATCH /api/client/ads/:id`
  - `POST /api/client/payments`
  - `GET /api/client/dashboard`
- Moderator
  - `GET /api/moderator/review-queue`
  - `PATCH /api/moderator/ads/:id/review`
- Admin
  - `GET /api/admin/payment-queue`
  - `PATCH /api/admin/payments/:id/verify`
  - `PATCH /api/admin/ads/:id/publish`
  - `GET /api/admin/analytics`
- Public
  - `GET /api/ads`
  - `GET /api/ads/:id`

## Frontend setup

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`.

## Supabase-ready DB layer

`server/src/db/index.js` exposes a modular DB adapter interface so the underlying provider can later be replaced with Supabase/PostgREST-backed implementation while keeping service/controller APIs stable.
