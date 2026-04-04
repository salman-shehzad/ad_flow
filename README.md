# AdFlow Pro API (Implemented Core)

This repository now includes a runnable Node.js implementation of the AdFlow marketplace workflow, with:

- End-to-end ad lifecycle state machine
- Role-oriented API surfaces (client/moderator/admin)
- Dashboard/analytics endpoints
- Cron automation for scheduled publishing, expiry, notifications, and health checks
- Test coverage for workflow and API flow
# 🚀 AdFlow Pro

AdFlow Pro is a full-stack sponsored ads marketplace platform that simulates a real-world advertisement management system. It includes ad creation, moderation, payment verification, scheduling, and analytics.

## Quick start

```bash
## 📌 Features

### 👥 Role-Based Access (RBAC)

* **Client** – Create and manage ads, submit payments
* **Moderator** – Review and approve/reject ads
* **Admin** – Verify payments, publish ads
* **Super Admin** – Full system control

---

### 🔄 Ad Workflow

Ads follow a strict lifecycle:

```
Draft → Submitted → Under Review → Payment Pending
→ Payment Submitted → Payment Verified
→ Scheduled → Published → Expired
```

✔ Only **Published ads** are visible
✔ Ads automatically expire
✔ Payment verification is required

---

### 💳 Payment System

* Manual payment submission
* Transaction ID + screenshot URL
* Admin verifies payment before publishing

---

### 🖼️ Media Handling

* Accepts **URL-based media only**
* Supports:

  * Image URLs
  * YouTube links
* Thumbnail generation for videos
* Fallback for broken links

---

### 📊 Analytics Dashboard

* Total ads
* Active ads
* Revenue tracking
* Approval rate
* Ads by category

---

### 🧮 Ranking System

Ads are ranked using:

```
rankScore = (featured ? 50 : 0) + (packageWeight * 10) + freshness + adminBoost
```

Premium ads appear higher in listings.

---

### ⏰ Automation (Cron Jobs)

* Auto-publish scheduled ads
* Auto-expire ads
* Notification system (optional)

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL (Supabase-ready)

### Authentication

* JWT-based authentication

---

## 📁 Project Structure

```
AdFlow-Pro/
│
├── client/        # React frontend
├── server/        # Express backend
├── shared/        # Shared configs/types
└── README.md
```

---

## 🔌 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Client

* `POST /api/client/ads`
* `PATCH /api/client/ads/:id`
* `POST /api/client/payments`
* `GET /api/client/dashboard`

### Moderator

* `GET /api/moderator/review-queue`
* `PATCH /api/moderator/ads/:id/review`

### Admin

* `GET /api/admin/payment-queue`
* `PATCH /api/admin/payments/:id/verify`
* `PATCH /api/admin/ads/:id/publish`

### Public

* `GET /api/ads`
* `GET /api/ads/:id`

---

## ▶️ Getting Started

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/adflow-pro.git
cd adflow-pro
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
npm test
npm start
```

Server runs on `http://localhost:3000` by default.

## Implemented API
---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

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
## ⚙️ Environment Variables

Create `.env` file in `server/`:

```
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=your_database_url
```

### Admin
- `PATCH /api/admin/payments/:id/verify`
- `PATCH /api/admin/ads/:id/schedule`
- `PATCH /api/admin/ads/:id/publish`
- `GET /api/dashboards/admin`
- `GET /api/dashboards/analytics`

## Workflow states

`Draft → Submitted → Under Review → Payment Pending → Payment Submitted → Payment Verified → Scheduled/Published → Expired → Archived`
## 🧪 Sample Data

* Includes seeded ads (15+)
* Categories and cities
* Demo users for all roles

Rejected ads follow:

`Under Review → Rejected → Archived`

## Cron jobs

- Every minute: publish due scheduled ads
- Every 2 minutes: expire outdated ads
- Every 5 minutes: generate expiry notifications
- Every 10 minutes: record datastore health audit logs
## 🔮 Future Improvements

* Supabase integration
* Real-time notifications
* Image upload support
* Stripe payment gateway

---

## 📦 Deployment

* Frontend → Vercel
* Backend → Render / Railway

---

## 📚 Learning Outcomes

This project demonstrates:

* Real-world workflow system design
* Role-based access control
* Backend architecture (MVC)
* API design and integration
* Full-stack deployment

---

## 👨‍💻 Author

Developed by: **Your Name**

---

## 📄 License

This project is for academic purposes.
