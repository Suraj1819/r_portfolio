# Suraj Kumar — Premium Full-Stack Developer Portfolio

Production-oriented personal portfolio with seven primary pages, project case studies, light/dark theme, and a secure contact API (Express + PostgreSQL + email).

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Framer Motion, Three.js (optional hero) |
| Backend | Node.js, Express (ESM), Zod, Helmet, CORS, express-rate-limit |
| Database | PostgreSQL |
| Email | Resend (or any compatible transactional API key) |
| Deploy | Vercel (client), Render (API), managed PostgreSQL |

## Project structure

```
portfolio/
├── client/                 # Vite + React SPA
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
├── server/                 # Express API
│   ├── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   └── package.json
├── package.json
└── README.md
```

## Primary routes

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/skills` | Skills |
| `/projects` | Projects list |
| `/projects/:slug` | Project case study |
| `/experience` | Experience |
| `/achievements` | Achievements |
| `/contact` | Contact form |

## Setup

### 1. Install dependencies

```bash
cd portfolio
npm run install:all
```

### 2. Environment

**Server** — copy `server/.env.example` to `server/.env`:

```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
CLIENT_ORIGIN=http://localhost:5173
EMAIL_API_KEY=re_xxxxxxxx
CONTACT_FROM_EMAIL=portfolio@yourdomain.com
CONTACT_TO_EMAIL=you@yourdomain.com
```

**Client** — copy `client/.env.example` to `client/.env` if needed:

```
VITE_API_URL=
```

Leave `VITE_API_URL` empty in development (Vite proxies `/api` → `localhost:3001`). In production set it to your API origin.

### 3. Database migration

```bash
cd server
# Ensure DATABASE_URL is set
npm run migrate
```

Creates `contact_messages` with indexes and status checks.

### 4. Development

From repo root:

```bash
npm run dev
```

- Client: http://localhost:5173  
- API: http://localhost:3001  
- Health: http://localhost:3001/api/v1/health  

### 5. Production build (client)

```bash
npm run build
```

Output: `client/dist`. Deploy this folder to Vercel (or static host) with SPA fallback to `index.html`.

## API

### `POST /api/v1/contact`

Accepts JSON:

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Project enquiry",
  "inquiryType": "freelance",
  "message": "I would like to discuss a web development project.",
  "privacyAccepted": true
}
```

| Status | Meaning |
|--------|---------|
| 201 | Stored (email may still fail; `email_status` recorded) |
| 400 | Validation error |
| 413 | Body too large |
| 429 | Rate limit |
| 503 | Database unavailable |

### `GET /api/v1/health`

Returns service status without secrets.

## Security

- Server-side Zod validation  
- Request size limit (32kb)  
- Rate limiting (5 / 15 min per IP, in-memory; use Redis store for multi-instance)  
- CORS allowlist via `CLIENT_ORIGIN`  
- Helmet headers  
- Honeypot field on the contact form  
- Parameterized SQL  
- Secrets only in server env (never `VITE_*` for keys)  
- HTML escaped in notification emails  

**Retention:** Review and delete contact messages older than 24 months (or sooner on request). Example SQL is in the migration file.

## Deployment

### Frontend (Vercel)

1. Root directory: `client` (or monorepo with build command `npm run build --prefix client`).  
2. Output: `dist`.  
3. Framework preset: Vite.  
4. Set `VITE_API_URL` to your API public URL.  
5. Ensure SPA rewrites: all routes → `/index.html`.

### Backend (Render)

1. Root: `server`.  
2. Build: `npm install`.  
3. Start: `npm start`.  
4. Set env vars from `.env.example`.  
5. Attach managed PostgreSQL and run `npm run migrate`.  
6. Set `CLIENT_ORIGIN` to the Vercel URL (comma-separated if multiple).

### Email (Resend)

1. Create API key and verify domain/sender.  
2. Set `EMAIL_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.  
3. If DB insert succeeds but email fails, the message remains stored with `email_status = failed`.

## Resume

Place a PDF at `client/public/resume.pdf` so the Download Resume buttons work. Update `profile.email` and LinkedIn in `client/src/data/profile.js` with real values before production.

## Configuration checklist before go-live

- [ ] Real email in `profile.js`  
- [ ] Resume PDF in `public/`  
- [ ] LinkedIn URL if available  
- [ ] `DATABASE_URL` and migration applied  
- [ ] Resend (or provider) verified sender  
- [ ] `CLIENT_ORIGIN` matches production frontend  
- [ ] `VITE_API_URL` set for production client  
- [ ] No secrets committed  

## Design system

Warm cream / amber / charcoal tokens via CSS variables. Space Grotesk (display) + Inter (body). Light and dark themes with persistence in `localStorage`.

## Optional admin dashboard

Not included by default. Public contact storage and email are the priority. Add a secured admin only with real auth, HTTP-only sessions, and server-side authorization on every endpoint.

## License

Personal portfolio project for Suraj Kumar.
