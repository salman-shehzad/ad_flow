# AdFlow Pro

AdFlow Pro is a full-stack sponsored ads marketplace with moderation, payment verification, scheduling, analytics, and a strict ad lifecycle.

https://ad-flow-meow36qd5-salmanshehzad780-1553s-projects.vercel.app/

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL via a modular repository layer
- Auth: JWT
- API: REST

## Project Structure

- `client/` React application
- `server/` Express API with MVC layering
- `shared/` shared constants and workflow definitions

## Core Workflow

Ads move through this lifecycle:

`Draft -> Submitted -> Under Review -> Payment Pending -> Payment Submitted -> Payment Verified -> Scheduled -> Published -> Expired`

Rules enforced in code:

- Only `Published` ads appear in public APIs
- Expired ads are hidden
- Ads cannot be published until payment is verified
- Rejected ads can be revised and resubmitted

## Backend Setup

1. Create a PostgreSQL database named `adflow_pro`.
2. Copy `server/.env.example` to `server/.env` and update values.
3. Run:

```bash
cd server
npm install
npm run dev
```

The API starts on `http://localhost:5000` by default. On first boot it creates tables and seeds sample data.

### Seed Credentials

All seeded users use password: `Password123!`

- Client: `client@adflow.pro`
- Moderator: `moderator@adflow.pro`
- Admin: `admin@adflow.pro`
- Super Admin: `super@adflow.pro`

## Frontend Setup

1. Copy `client/.env.example` to `client/.env`.
2. Run:

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Vercel Deployment

This repo supports deploying both the Vite frontend and the Express API on one Vercel project.

Required Vercel environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `JWT_SECRET`
- `CLIENT_URL`

Recommended values:

- `CLIENT_URL=https://your-vercel-domain.vercel.app`
- `VITE_API_URL=/api`

Notes:

- The frontend uses `/api` automatically in production if `VITE_API_URL` is not set.
- The backend is exposed through the Vercel serverless function at `/api`.
- Supabase Postgres connections use SSL automatically when `DATABASE_URL` points to `supabase.co`.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Client

- `POST /api/client/ads`
- `PATCH /api/client/ads/:id`
- `POST /api/client/payments`
- `GET /api/client/dashboard`

### Moderator

- `GET /api/moderator/review-queue`
- `PATCH /api/moderator/ads/:id/review`

### Admin

- `GET /api/admin/payment-queue`
- `GET /api/admin/ads/ready`
- `PATCH /api/admin/payments/:id/verify`
- `PATCH /api/admin/ads/:id/publish`
- `GET /api/admin/analytics`

### Public

- `GET /api/ads`
- `GET /api/ads/:id`
- `GET /api/packages`
- `GET /api/filters`

## Ranking Logic

Public ads are ordered using:

`rankScore = (featured ? 50 : 0) + (packageWeight * 10) + freshness + adminBoost`

The implementation applies freshness based on recency and includes admin boosts in the query sort order.

## Automation and Scheduling

Cron jobs included in the server:

- Hourly: publish ads whose `publish_at` is due
- Daily: expire ads past `expire_at`

## Notes

- Media uses URL-only validation, with YouTube thumbnail detection and placeholder fallback.
- The repository/data-access layer is isolated so a Supabase adapter can replace the PostgreSQL adapter later.
- The workspace includes 15 seeded sample ads spanning multiple lifecycle states.
