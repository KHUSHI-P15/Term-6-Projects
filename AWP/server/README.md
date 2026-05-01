# DMS Server

Run (requires MongoDB running locally or `MONGO_URI` in .env):

```
cd server
npm install
npm run dev
```

Environment:
- Create `.env` with `MONGO_URI` and `JWT_SECRET` for production.
- Optional: `PORT=4000`

API endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users` (admin)
- `POST /api/users/:id/role` (admin)
- `GET /api/documents`
- `POST /api/documents/upload` (multipart/form-data `file`)
- `PUT /api/documents/:id`
- `DELETE /api/documents/:id`
- `GET /api/stats`
- `GET /api/reports/overview` (admin)
