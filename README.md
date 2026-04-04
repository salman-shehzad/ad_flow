# 🚀 AdFlow Pro

AdFlow Pro is a full-stack sponsored ads marketplace platform that simulates a real-world advertisement management system. It includes ad creation, moderation, payment verification, scheduling, and analytics.

---

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
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

---

## ⚙️ Environment Variables

Create `.env` file in `server/`:

```
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=your_database_url
```

---

## 🧪 Sample Data

* Includes seeded ads (15+)
* Categories and cities
* Demo users for all roles

---

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
