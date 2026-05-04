# 🏠 EasyHomeSearch

A full-stack real-estate search platform with interactive maps, JWT authentication, and a PostgreSQL/PostGIS backend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Leaflet maps |
| **Backend** | Node.js 18, Express 4, JWT, bcryptjs |
| **Database** | PostgreSQL 16 + PostGIS (geo search) |
| **Mobile** | Expo (React Native) |
| **Backend deploy** | [Railway](https://railway.app) |
| **Frontend deploy** | [Vercel](https://vercel.com) |
| **Database deploy** | [Supabase](https://supabase.com) |

## Features

- 🔍 Full-text + geo-radius listing search
- 🗺️ Interactive Leaflet map with PostGIS ST\_DWithin
- 🔒 JWT authentication (register / login / me)
- ❤️ Save & unsave favourite listings
- 📱 Expo mobile app (iOS & Android)
- 🐳 Docker Compose for local development
- 🌱 Demo seed data (6 listings, 3 users)

## Repository Structure

```
easyhomesearch/
├── backend/          # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── db.js
│   │   └── index.js
│   ├── .env.example
│   ├── Dockerfile
│   ├── Procfile
│   └── railway.json
├── frontend/         # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   ├── Dockerfile
│   └── vercel.json
├── mobile/           # Expo React Native app
│   └── src/
│       ├── navigation/
│       ├── screens/
│       └── services/
├── database/
│   ├── schema.sql    # Run once on a fresh DB
│   └── seed.sql      # Demo data
└── docker-compose.yml
```

## Quick Start (Docker)

```bash
git clone https://github.com/darshangowdakpec22-max/easyhomesearch.git
cd easyhomesearch
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:4000
- PostgreSQL → localhost:5432

## Local Development (without Docker)

### Prerequisites

- Node.js ≥ 18
- PostgreSQL 14+ with PostGIS extension

### 1. Database

```bash
psql -U postgres -c "CREATE DATABASE easyhomesearch;"
psql -U postgres -d easyhomesearch -f database/schema.sql
psql -U postgres -d easyhomesearch -f database/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit DATABASE_URL and JWT_SECRET
npm install
npm run dev            # runs on http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL if needed
npm install
npm run dev            # runs on http://localhost:5173
```

### 4. Mobile

```bash
cd mobile
npm install
npx expo start         # scan QR with Expo Go app
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Buyer | buyer@demo.com | password123 |
| Agent | alice@demo.com | password123 |
| Agent | bob@demo.com | password123 |

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/listings` | — | List/search listings |
| GET | `/api/listings/:id` | — | Get listing |
| POST | `/api/listings` | ✓ | Create listing |
| PUT | `/api/listings/:id` | ✓ | Update listing |
| DELETE | `/api/listings/:id` | ✓ | Delete listing |
| POST | `/api/listings/:id/save` | ✓ | Save listing |
| DELETE | `/api/listings/:id/save` | ✓ | Unsave listing |
| GET | `/api/listings/saved` | ✓ | My saved listings |
| GET | `/api/users/profile` | ✓ | Get profile |
| PUT | `/api/users/profile` | ✓ | Update profile |
| PUT | `/api/users/change-password` | ✓ | Change password |
| GET | `/api/users/my-listings` | ✓ | My listings |

## Deployment

### 1. Database → Supabase

1. Create a project at https://supabase.com
2. Go to **SQL Editor** and run `database/schema.sql`
3. Then run `database/seed.sql` for demo data
4. Copy the **connection string** (Settings → Database)

### 2. Backend → Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select this repo, set **Root Directory** to `backend`
3. Add environment variables:
   - `DATABASE_URL` = Supabase connection string
   - `DATABASE_SSL` = `true`
   - `JWT_SECRET` = any long random string
   - `CORS_ORIGIN` = your Vercel frontend URL
4. Deploy — Railway auto-detects `Procfile`

### 3. Frontend → Vercel

1. Go to https://vercel.com → Add New Project → Import from GitHub
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.railway.app/api`
4. Deploy — Vercel auto-detects Vite

## Revenue Model

- Subscription plans for premium listing features
- Agent partnership / featured listing placements
- Display advertising on search results

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

## License

MIT © EasyHomeSearch
