
# 🚀 AdFlow Pro – Sponsored Listing Marketplace

AdFlow Pro is a production-style classified ads platform built using the MERN/Next.js stack. It implements a real-world workflow where ads are submitted, reviewed, verified, and published based on package rules and system automation.

---

## 📌 Project Overview

AdFlow Pro is designed to simulate a real business workflow system rather than a simple CRUD app.

### 🔑 Core Features

* Only **approved ads** are publicly visible
* Ads follow a **multi-stage lifecycle** (Draft → Review → Payment → Publish → Expire)
* **External media URLs only** (no file uploads)
* **Role-based system** (Client, Moderator, Admin, Super Admin)
* **Package-based ranking & visibility**
* Automated **publishing and expiry system**

---

## 🧑‍🤝‍🧑 User Roles

| Role        | Responsibilities                         |
| ----------- | ---------------------------------------- |
| Client      | Create ads, submit payment, track status |
| Moderator   | Review ads, approve/reject content       |
| Admin       | Verify payments, publish ads             |
| Super Admin | Manage system, packages, categories      |

---

## ⚙️ Tech Stack

* **Frontend:** React / Next.js
* **Backend:** Node.js + Express / API Routes
* **Database:** Supabase (PostgreSQL)
* **Authentication:** JWT / Supabase Auth
* **Deployment:** Vercel
* **Styling:** Tailwind CSS / Material UI

---

## 📊 Key Modules

### 🌐 Public Pages

* Home (Featured Ads, Packages)
* Explore Ads (Search & Filters)
* Ad Details Page
* Category & City Listings
* Packages Page

### 📋 Dashboards

* Client Dashboard (Manage Ads)
* Moderator Panel (Review Ads)
* Admin Dashboard (Verify & Publish)
* Analytics Dashboard

---

## 🔄 Ad Lifecycle Workflow

```id="w2p8qf"
Draft → Submitted → Under Review → Payment Pending → Payment Submitted 
→ Payment Verified → Scheduled → Published → Expired → Archived
```

* Only **Published ads** are visible publicly
* Ads automatically expire after package duration

---

## 💳 Package System

| Package  | Duration | Visibility | Priority |
| -------- | -------- | ---------- | -------- |
| Basic    | 7 days   | Normal     | Low      |
| Standard | 15 days  | Category   | Medium   |
| Premium  | 30 days  | Homepage   | High     |

---

## 🧠 Ranking Logic

Ads are ranked using a score system:

```id="k8d9sl"
rankScore = featured + packageWeight + freshness + adminBoost
```

* Featured ads appear first
* Premium ads have higher priority
* New ads get temporary boost

---

## 🗄️ Database Tables (Core)

* users
* ads
* packages
* categories
* cities
* payments
* ad_media
* notifications
* audit_logs

---

## 🔌 API Endpoints (Examples)

```id="d4t7mf"
POST   /api/auth/register
POST   /api/auth/login
GET    /api/ads
POST   /api/client/ads
GET    /api/moderator/review-queue
PATCH  /api/admin/payments/:id/verify
PATCH  /api/admin/ads/:id/publish
```

---

## ⏰ Automation (Cron Jobs)

* Publish scheduled ads
* Expire outdated ads
* Send expiry notifications
* Monitor database health

---

## 📈 Analytics

* Total ads & active listings
* Revenue by package
* Approval/rejection rates
* Ads by category & city

---

## 🛠️ Installation

```bash id="n5v3ka"
git clone https://github.com/your-username/adflow-pro.git
cd adflow-pro
npm install
npm run dev
```

---

## 🎯 Learning Outcomes

* Role-Based Access Control (RBAC)
* Workflow-based backend logic
* Database design with PostgreSQL
* API design & validation
* Real-world system architecture

---

## 🚀 Future Improvements

* Saved ads / bookmarks
* Spam detection system
* Email/WhatsApp notifications
* Seller verification badges

---

## 👨‍💻 Author

Your Name
GitHub: https://github.com/your-username

---

## 📄 License

This project is for educational purposes and follows standard open-source practices.

---
