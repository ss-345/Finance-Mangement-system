<div align="center">

# 💹 FinanceOS

### Finance Data Processing & Access Control Backend

A full-stack finance dashboard system with role-based access control, aggregated analytics, and secure JWT authentication.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

<br/>
 
🌐 **[Live Frontend](https://finance-mangement-system-frontend.vercel.app/)** &nbsp;|&nbsp; 
🔌 **[Live API](https://finance-mangement-system-backend.vercel.app/)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Assignment Coverage](#-assignment-coverage)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Role Permissions](#-role-permissions-matrix)
- [Architecture Decisions](#-architecture-decisions--assumptions)
- [What Makes This Stand Out](#-what-makes-this-stand-out)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🧭 Overview

FinanceOS is a backend-first finance dashboard system designed to simulate real-world data access patterns. It supports three distinct user roles — **Viewer**, **Analyst**, and **Admin** — each with clearly scoped permissions enforced at the API layer via JWT authentication and composable RBAC middleware.

The system includes full transaction lifecycle management, MongoDB aggregation pipelines for dashboard analytics, soft-delete auditing, paginated list endpoints, and a React frontend for end-to-end testing.

---

## ✨ Features

- 🔐 **JWT Authentication** — Stateless auth with token expiry and bcrypt password hashing (12 rounds)
- 👥 **Role-Based Access Control** — Three roles: `viewer`, `analyst`, `admin` with composable middleware
- 📊 **Dashboard Analytics** — 5 aggregated endpoints using MongoDB `$aggregate` pipelines
- 🗂 **Transaction Management** — Full CRUD with filtering, pagination, search, and soft delete
- 🛡 **Dual Validation** — `express-validator` on input + Mongoose schema-level enforcement
- 🚦 **Rate Limiting** — Stricter limits on auth routes, general limits on all others
- 🔎 **Search & Filters** — Description search and filter by type, category, and date range
- 📄 **Pagination** — Consistent `{ total, page, limit, totalPages, hasNextPage }` on all lists
- 🗑 **Soft Delete** — Transactions are never permanently removed; hidden via Mongoose pre-find hook
- 🌐 **React Frontend** — Built with Vite + Tailwind CSS for full end-to-end testing

---

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | Node.js + Express.js                    |
| Database   | MongoDB + Mongoose                      |
| Auth       | JWT (`jsonwebtoken`) + `bcryptjs`       |
| Frontend   | React.js + Vite + Tailwind CSS          |
| Validation | `express-validator`                     |
| Security   | `express-rate-limit`, bcrypt (12 rounds)|

---

## ✅ Assignment Coverage

| Requirement              | Status | Notes                                         |
|--------------------------|--------|-----------------------------------------------|
| User & Role Management   | ✅     | 3 roles: `viewer`, `analyst`, `admin`         |
| Financial Records CRUD   | ✅     | Full create / read / update / delete          |
| Dashboard Summary APIs   | ✅     | 5 aggregated endpoints                        |
| Access Control (RBAC)    | ✅     | JWT + role middleware on every route          |
| Validation & Error Handling | ✅  | `express-validator` + global error handler    |
| Data Persistence         | ✅     | MongoDB via Mongoose                          |
| Authentication           | ✅     | JWT-based auth                                |
| Pagination               | ✅     | Implemented on all list endpoints             |
| Soft Delete              | ✅     | Transactions soft-deleted via pre-find hook   |
| Rate Limiting            | ✅     | `express-rate-limit` on all routes            |
| Search                   | ✅     | Description search on transactions            |

---

## 🗂 Project Structure

```
finance-dashboard/
├── backend/
|   ├── api/
|       ├──index.js
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js                  # User schema + role enum
│   │   │   └── Transaction.js           # Transaction schema + soft delete hook
│   │   ├── middleware/
│   │   │   ├── auth.js                  # JWT verification
│   │   │   └── rbac.js                  # Role-based access middleware
│   │   ├── validators/
│   │   │   ├── authValidators.js
│   │   │   └── transactionValidators.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── transactionController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   ├── server.js
|   └── vercel.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js                 # Axios instance with JWT interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx          # Auth state + login/register/logout
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── TransactionTable.jsx
    │   │   └── TransactionForm.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Transactions.jsx
    │   │   └── Users.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vercel.json
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/ss-345/Finance-Mangement-system

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**`backend/.env`**

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/finance_dashboard
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

> 💡 **Tip:** Register with `role: "admin"` first to unlock full access. The frontend includes a role selector on the registration page.

---
## 🌐 API Reference
 
### Health Check
 
Verify the backend is live — no authentication required.
 
```
GET /api/health
```
 
**Response:**
 
```json
{
  "success": true,
  "message": "Finance API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```
 
> 🔗 Try it live: [finance-mangement-system-backend.vercel.app/api/health](https://finance-mangement-system-backend.vercel.app/api/health)
 
---

### Authentication

| Method | Endpoint             | Description       | Auth     |
|--------|----------------------|-------------------|----------|
| POST   | `/api/auth/register` | Register new user | None     |
| POST   | `/api/auth/login`    | Login             | None     |
| GET    | `/api/auth/me`       | Get current user  | Token    |

---

### Users *(Admin only)*

| Method | Endpoint          | Description            |
|--------|-------------------|------------------------|
| GET    | `/api/users`      | List all users         |
| GET    | `/api/users/:id`  | Get single user        |
| PATCH  | `/api/users/:id`  | Update role or status  |
| DELETE | `/api/users/:id`  | Delete user            |

---

### Transactions

| Method | Endpoint                  | Description                    | Roles                     |
|--------|---------------------------|--------------------------------|---------------------------|
| GET    | `/api/transactions`       | List (filter + paginate)       | viewer, analyst, admin    |
| GET    | `/api/transactions/:id`   | Get single record              | viewer, analyst, admin    |
| POST   | `/api/transactions`       | Create record                  | admin                     |
| PUT    | `/api/transactions/:id`   | Update record                  | admin                     |
| DELETE | `/api/transactions/:id`   | Soft delete                    | admin                     |

**Query Parameters for `GET /api/transactions`:**

| Param       | Type    | Description                             |
|-------------|---------|------------------------------------------|
| `type`      | string  | Filter by `income` or `expense`          |
| `category`  | string  | Filter by category name                  |
| `startDate` | date    | ISO date string — range start            |
| `endDate`   | date    | ISO date string — range end              |
| `search`    | string  | Search in description field              |
| `page`      | number  | Page number (default: `1`)               |
| `limit`     | number  | Records per page (default: `20`)         |

---

### Dashboard

| Method | Endpoint                          | Description                   | Roles              |
|--------|-----------------------------------|-------------------------------|--------------------|
| GET    | `/api/dashboard/summary`          | Income / Expense / Balance    | viewer, analyst, admin |
| GET    | `/api/dashboard/recent-activity`  | Latest 10 transactions        | viewer, analyst, admin |
| GET    | `/api/dashboard/category-totals`  | Per-category breakdown        | analyst, admin     |
| GET    | `/api/dashboard/monthly-trends`   | Last 12 months                | analyst, admin     |
| GET    | `/api/dashboard/weekly-trends`    | Last 7 days                   | analyst, admin     |

---

## 🔐 Role Permissions Matrix

| Action                        | Viewer | Analyst | Admin |
|-------------------------------|:------:|:-------:|:-----:|
| View transactions             | ✅     | ✅      | ✅    |
| Create / Update / Delete records | ❌  | ❌      | ✅    |
| View summary                  | ✅     | ✅      | ✅    |
| View category & trend insights| ❌     | ✅      | ✅    |
| Manage users                  | ❌     | ❌      | ✅    |

---

## 🏗 Architecture Decisions & Assumptions

1. **Soft Delete** — Transactions are never permanently removed. `isDeleted: true` hides them from all queries via a Mongoose pre-find hook, preserving audit history.

2. **Password never returned** — `select: false` on the `password` field in the User schema ensures it never appears in any API response.

3. **JWT in localStorage** — Token is stored in `localStorage` for simplicity. A production system should use `httpOnly` cookies to protect against XSS.

4. **Aggregation pipelines** — All dashboard endpoints use MongoDB's `$aggregate` pipeline for efficiency, avoiding application-level data processing.

5. **Pagination defaults** — All list endpoints default to `page=1`, `limit=20` if not specified. Responses always include `{ total, page, limit, totalPages, hasNextPage, hasPrevPage }`.

6. **Category enum enforced at two levels** — Both `express-validator` (input layer) and Mongoose schema (model layer) validate category values for stronger data integrity.

---

## 🌟 What Makes This Stand Out

| Feature                 | Implementation Detail                                                   |
|-------------------------|-------------------------------------------------------------------------|
| Clean Architecture      | Routes → Controllers → Models — no logic leakage between layers         |
| Composable RBAC         | `authorize(...roles)` middleware is reusable across any route           |
| Transparent Soft Delete | Pre-find Mongoose hook — automatically applied to all queries           |
| Real Aggregation        | MongoDB `$aggregate` pipelines for dashboard — not application-level    |
| Dual Validation         | `express-validator` on input + Mongoose schema enforcement              |
| Uniform Error Handling  | Global handler catches Mongoose, JWT, and duplicate key errors          |
| Tiered Rate Limiting    | Stricter on auth routes (20 / 15 min), general (200 / 15 min)          |
| Consistent Pagination   | Standard shape on every list endpoint                                   |

---

## 🔮 Future Improvements

- [ ] CSV / PDF export for transaction records
- [ ] Email notifications for large transactions
- [ ] Admin-only account creation (remove open role assignment)
- [ ] Docker Compose setup for one-command local development

---

## 👤 Author

**Sujal Shaw**
- GitHub: [@ss-345](https://github.com/ss-345)
- Repository: [Finance-Mangement-system](https://github.com/ss-345/Finance-Mangement-system)

---
