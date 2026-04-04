# AdFlow Pro API (Implemented Core)

This repository now includes a runnable Node.js implementation of the AdFlow marketplace workflow, with:

- End-to-end ad lifecycle state machine
- Role-oriented API surfaces (client/moderator/admin)
- Dashboard/analytics endpoints
- Cron automation for scheduled publishing, expiry, notifications, and health checks
- Test coverage for workflow and API flow

## Quick start

```bash
npm install
npm test
npm start
```

Server runs on `http://localhost:3000` by default.

## Implemented API

### Core/public
- `GET /api/health`
- `GET /api/ads`
- `GET /api/meta/workflow`

### Client
- `POST /api/client/ads`
- `PATCH /api/client/ads/:id/submit`
- `POST /api/client/ads/:id/payments`
- `GET /api/dashboards/client`

### Moderator
- `GET /api/moderator/review-queue`
- `PATCH /api/moderator/ads/:id/decision`

### Admin
- `PATCH /api/admin/payments/:id/verify`
- `PATCH /api/admin/ads/:id/schedule`
- `PATCH /api/admin/ads/:id/publish`
- `GET /api/dashboards/admin`
- `GET /api/dashboards/analytics`

## Workflow states

`Draft → Submitted → Under Review → Payment Pending → Payment Submitted → Payment Verified → Scheduled/Published → Expired → Archived`

Rejected ads follow:

`Under Review → Rejected → Archived`

## Cron jobs

- Every minute: publish due scheduled ads
- Every 2 minutes: expire outdated ads
- Every 5 minutes: generate expiry notifications
- Every 10 minutes: record datastore health audit logs
