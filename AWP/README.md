# Document Management System (AngularJS + Express + MongoDB)

Production-style Document Management System with role-based access, JWT auth, document CRUD, search/filtering, upload workflow, and analytics.

## Stack
- Frontend: AngularJS (1.8), ngRoute, Chart.js, Tailwind (CDN)
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB
- Auth: JWT

## Features
- Secure login/register with JWT
- Admin/User role-based authorization
- Document management:
  - Upload
  - Grid/List views
  - Search and filtering
  - Edit metadata (title/tags)
  - Delete (owner/admin)
- Admin module:
  - User list
  - Change user roles
- Reports and analytics:
  - Upload trends chart
  - Tag distribution chart
- UX:
  - Dark theme (fixed, no toggle)
  - Debounced search
  - Toast notifications
  - Skeleton loading states
  - Responsive sidebar drawer
  - Breadcrumbs and keyboard shortcuts

## Project Structure
- `server/` Express API + MongoDB models/routes
- `client/` AngularJS SPA (static files)

## Prerequisites
- Node.js 18+
- MongoDB local instance or MongoDB Atlas URI

## 1) Run Backend
```powershell
cd server
npm install
$env:MONGO_URI="mongodb://localhost:27017/dms"
$env:JWT_SECRET="change-this-secret"
npm run dev
```

## 2) Run Frontend
```powershell
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Base URL
Frontend proxies `/api` and `/uploads` to `http://localhost:4000` via Vite in development — no CORS issues.

For production, set `window.__API_BASE__` to your backend URL before the app loads:
```js
window.__API_BASE__ = 'https://your-api.example.com'
```

## Seed/First Admin
Register first user from the login page. To promote to admin, update directly in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## Notes
- Uploaded files are stored in `server/uploads/` and served from `/uploads/<filename>`.
- This is a full working baseline and ready for further hardening (rate limits, refresh token flow, audit logs, and tests).
