# Online Complaint Registration and Management System

A full-stack MERN complaint management platform where users register complaints, track status, receive updates, and communicate with assigned agents. Admins manage complaints, users, agents, and the resolution workflow.

## Tech Stack

**Frontend:** React.js + Vite, Tailwind CSS, React Router DOM, Axios

**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs

## Project Structure

```
complaint-management-system/
├── backend/          # Express API
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/         # React + Vite app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── README.md
```

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account

### 1. Clone and setup

```bash
cd complaint-management-system
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster1.mukprcm.mongodb.net/employees?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:5000`

Health check: `GET /` → `"Complaint Management API Running"`

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## MongoDB Atlas Setup

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Database name: `employees`
3. Collections: `complaint_users`, `complaints`, `notifications`

> **Note:** This app uses the `complaint_users` collection (not `users`) to avoid conflicts with other projects sharing the same database.
4. Network Access → Add IP Address → `0.0.0.0/0` (for Render deployment)
5. Create a database user and copy the connection string into `MONGO_URI`

### Create Admin User

Register a user via the app, then in MongoDB Atlas update their role:

```javascript
db.complaint_users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## API Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/users/register` | Public | Register user |
| POST | `/api/users/login` | Public | Login user |
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/agents` | Admin | List agents |
| DELETE | `/api/users/:id` | Admin | Delete user |
| POST | `/api/complaints` | Auth | Create complaint |
| GET | `/api/complaints` | Auth | List complaints |
| GET | `/api/complaints/:id` | Auth | Get complaint |
| PUT | `/api/complaints/:id` | Admin/Agent | Update complaint |
| DELETE | `/api/complaints/:id` | Admin | Delete complaint |
| GET | `/api/complaints/analytics` | Admin | Dashboard stats |

## User Roles

- **user** — Register and track own complaints
- **agent** — View assigned complaints, update status
- **admin** — Full access: manage all complaints, users, agents, analytics

## Render Deployment

### Backend (Web Service)

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

**Environment Variables:**

```
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_secret_key>
PORT=5000
```

### Frontend (Static Site)

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

**Environment Variable:**

```
VITE_API_URL=https://your-backend-name.onrender.com
```

> **Important:** `VITE_API_URL` is baked in at build time. Set it to your Render backend URL before deploying the frontend. Redeploy frontend if the backend URL changes.

> **SPA routing:** `frontend/public/_redirects` is included so client-side routes work on Render Static Sites.

### Deployment Order

1. Deploy backend first
2. Copy the backend URL (e.g. `https://complaint-api.onrender.com`)
3. Set `VITE_API_URL` on frontend Render service
4. Deploy frontend

## Complaint Status Flow

```
Pending → Assigned → In Progress → Resolved → Closed
```

## Security Notes

- Never commit `.env` files
- Use strong `JWT_SECRET` in production
- Rotate MongoDB credentials if exposed
- Restrict Atlas IP access in production if possible

## License

MIT
