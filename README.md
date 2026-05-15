# 🎓 YS EDU — Educational Consultancy & CBT Platform

A production-ready, full-stack platform built for **Yoj Simcha Educational Consultancy**. It features a powerful Computer Based Testing (CBT) engine for mock exams (WAEC, NECO, UTME), global question bank management, and comprehensive study abroad service routing.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, Tailwind CSS, Framer Motion, Zustand |
| **Backend** | Node.js, Express.js, MongoDB + Mongoose |
| **Auth** | JWT + Refresh Tokens, bcryptjs |
| **Payments** | Stripe Checkout |
| **Media** | Cloudinary (images + videos) |
| **Real-time** | Socket.io (Notifications) |
| **Email** | Nodemailer |
| **PDF** | PDFKit (Certificates & Results) |

---

## 📁 Project Structure

```text
YS-EDU-LMS/
├── backend/
│   ├── src/
│   │   ├── config/         # DB, Cloudinary config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling, validation
│   │   ├── models/         # Mongoose schemas (User, Test, Question)
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helpers (email, tokens, PDF)
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI (CourseCard, Loaders)
    │   │   └── layout/     # MainLayout, DashboardLayout
    │   ├── pages/          # Page components
    │   │   ├── auth/       # Login, Register, Password Reset
    │   │   ├── student/    # TestEngine, Progress, Certificates
    │   │   ├── instructor/ # TestManagement, CreateTest, Analytics
    │   │   └── admin/      # QuestionBank, ActiveTests, Users
    │   ├── services/       # API service layer (axios)
    │   ├── store/          # Zustand state management
    │   └── lib/            # Utility functions
    ├── .env.example
    └── package.json

```

---

## ⚙️ Setup & Installation

### Prerequisites

* Node.js 18+
* MongoDB Atlas account
* Cloudinary account
* Stripe account

### 1. Clone & Install

```bash
# Backend Setup
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend Setup (in a new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev

```

### 2. Environment Variables

**Backend `.env`:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
EMAIL_FROM=YS EDU <noreply@ysedu.com>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173

```

**Frontend `.env`:**

```env
# Point this to localhost in dev, and Render in prod
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

```

---

## 🌐 Core API Services

Our frontend utilizes a modular API service architecture (`src/services/api.js`):

| Service | Primary Function |
| --- | --- |
| `authService` | Login, Register, Password resets, Email verification |
| `testService` | Instructor creation and management of CBT Mock Exams |
| `questionService` | Admin management of the Global Question Bank |
| `adminService` | Platform-wide oversight of all users, tests, and analytics |
| `enrollmentService` | Student exam registration and progress tracking |

---

## 🚀 Deployment Architecture

This platform utilizes a decoupled deployment strategy to bypass serverless timeouts during heavy backend operations (like PDF generation).

### 1. Backend → Render.com

1. Connect your GitHub repository to Render as a **Web Service**.
2. Set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. *Copy the generated Render URL (e.g., `https://ys-edu-api.onrender.com`).*

### 2. Frontend → Vercel

1. Import your repository into Vercel.
2. Set Root Directory to `frontend`.
3. Add the Environment Variable: `VITE_API_URL` = `https://ys-edu-api.onrender.com/api`
4. Deploy. Vercel automatically handles the Vite build process.

---

## 🔑 Key Features

* ✅ **Advanced CBT Engine:** Time-bound mock exams mimicking UTME, WAEC, and NECO interfaces.
* ✅ **Global Question Bank:** Admins can pool thousands of questions for instructors to use.
* ✅ **Role-Based Dashboards:** Isolated, secure environments for Students, Instructors, and Admins.
* ✅ **Educational Consultancy Routing:** Dedicated service pages for Study Abroad, Visa Processing, and Scholarships.
* ✅ **Automated Grading & Analytics:** Instant test results and historical performance tracking.
* ✅ **Verifiable Certificates:** Auto-generated PDF certificates with unique verification IDs.
* ✅ **Secure Payments:** Stripe integration for premium mock exam access.
* ✅ **Dark/Light Mode:** Fully responsive, accessible, and modern UI.

---

## 📄 License & Copyright

© Yoj Simcha Educational Consultancy. All rights reserved.

```

```
