# VTI Phishing Simulation Platform

A full-stack MERN application for controlled phishing-awareness demonstrations in academic environments.

The platform simulates a credential-harvesting scenario, records submitted data for security analytics, and provides an admin dashboard for behavior trends and awareness reporting.

## Table of Contents

- Overview
- Core Capabilities
- Architecture
- Technology Stack
- Repository Structure
- API Reference
- Local Development

## Overview

This project is designed for classroom use in Cybersecurity and Network Security labs. It intentionally reproduces social-engineering patterns used in phishing campaigns so students can:

- observe credential submission behavior in a safe environment
- analyze attack outcomes using visual analytics
- practice post-incident awareness and defensive communication

The frontend delivers a realistic user journey. The backend captures submissions, secures admin endpoints with JWT authentication, and serves dashboard analytics from MongoDB.

## Core Capabilities

- Public simulation portal with form submission flow
- MongoDB-backed storage of simulated credential entries
- Admin authentication against MongoDB-stored admin account
- JWT-protected analytics APIs
- Private admin dashboard with trend visualizations
- Legacy API compatibility routes to preserve client continuity
- Built-in admin seed on backend startup

## Architecture

### High-level Flow

1. User submits simulated credentials from the portal.
2. Backend stores submission metadata and payload in MongoDB.
3. Admin authenticates via API and receives a JWT.
4. Dashboard uses Bearer token to fetch protected analytics.
5. Frontend route guard verifies active admin session via backend.

### Auth Model

- JWT is issued after successful admin login.
- Protected routes require `Authorization: Bearer <token>`.
- Current project mode uses non-expiring JWT tokens (per classroom requirement).

## Technology Stack

### Frontend

- React 18
- Vite 5
- React Router 6
- Recharts

### Backend

- Node.js
- Express 4
- Mongoose 8
- JSON Web Token (`jsonwebtoken`)
- CORS, dotenv

### Database

- MongoDB (local or Atlas)

## Repository Structure

```text
CNS/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      app.js
      server.js
    package.json

  frontend/
    src/
      api/
      components/
      pages/
      utils/
      App.jsx
      index.css
      main.jsx
    package.json

  README.md
```

## API Reference

Base URL: `http://localhost:5000/api`

### Health

- `GET /health`
  - Purpose: Service liveness check

### Admin

- `POST /admin/login`
  - Purpose: Validate admin credentials and return JWT
  
- `GET /admin/verify`
  - Purpose: Validate active JWT and return admin identity
  - Auth: Bearer token required

### Simulations

- `POST /simulations/login-demo`
  - Purpose: Store simulation submission

- `GET /simulations/stats`
  - Purpose: Return dashboard metrics and charts
  - Auth: Bearer token required

### Legacy Compatibility Routes

- `POST /simulations/login`
- `GET /simulations/analytics`
- `GET /simulations/submissions`

These routes remain available to avoid breaking older frontend integrations.

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local service or Atlas cluster)

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Start backend

```bash
cd backend
npm run dev
```

Backend: `http://localhost:5000`

### 3. Start frontend

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`

### 4. Build frontend for production

```bash
cd frontend
npm run build
```


