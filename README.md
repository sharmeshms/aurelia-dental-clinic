# Aurelia Dental Studio

A complete, production-oriented website and staff workspace for a private dental practice.
The public site is a full multi-page experience (not a landing page), backed by an Express API
with MongoDB persistence and a protected admin dashboard for appointments, enquiries and
editorial content.

> **Demonstration build.** Clinic details, clinicians, testimonials, statistics and photography
> are illustrative placeholders. Replace them with verified practice information before publishing.
> Nothing in this project constitutes medical advice or a guarantee of treatment outcomes.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Database behaviour](#database-behaviour)
- [Scripts](#scripts)
- [Admin workspace](#admin-workspace)
- [Editing content](#editing-content)
- [SEO](#seo)
- [Security notes](#security-notes)
- [Deployment checklist](#deployment-checklist)
- [Troubleshooting](#troubleshooting)

---

## Features

**Public site**

- Home, About, Services index, 20 individual treatment pages
- Doctors index and 6 clinician profiles
- Two-step appointment request wizard with live availability, validation, reference number,
  calendar (`.ics`) download and printable summary
- Patient information with fee guidance and a printable registration form
- Filterable gallery with lightbox (imagery labelled as illustrative)
- Testimonials (explicitly marked as sample content)
- Journal index and 8 full articles
- Contact form, newsletter sign-up, FAQ with search, site-wide search
- Privacy policy, terms, custom 404
- Responsive layouts, keyboard-friendly controls, reduced-motion support, semantic landmarks
- Per-page SEO metadata, Open Graph tags, JSON-LD, sitemap and robots.txt

**Admin workspace** (`/admin`)

- Cookie-based staff authentication (JWT in an httpOnly cookie, bcrypt password hashing)
- Overview dashboard with live counts and recent activity
- Appointment requests: search, status filters, confirm / complete / cancel, internal notes,
  delete, CSV export
- Contact enquiries inbox with read state
- Newsletter subscriber list with CSV export
- Full CRUD for treatments, clinicians, journal articles and gallery items
- Publish/unpublish toggles — changes appear on the public site immediately

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS 3, Framer Motion |
| Forms | React Hook Form + Zod (client), Zod (server) |
| Backend | Node.js (ES modules), Express 4 |
| Database | MongoDB via Mongoose, with a JSON-file fallback store |
| Auth | JSON Web Tokens in httpOnly cookies, bcryptjs |
| Hardening | Helmet, CORS allow-list, rate limiting, input validation |

---

## Project structure

```
.
├─ client/                 React application (Vite)
│  ├─ public/              Static assets, favicon, robots.txt, sitemap.xml
│  │  └─ images/           Locally hosted photography
│  └─ src/
│     ├─ admin/            Protected staff workspace
│     ├─ components/       UI primitives, cards, layout, sections, forms
│     ├─ config/           Central brand & contact configuration
│     ├─ data/             Typed content exports and helpers
│     ├─ lib/              API client, SEO, hooks, utilities
│     └─ pages/            Public routes
├─ content/                Editorial source of truth (JSON)
│  ├─ services.json        20 treatments
│  ├─ doctors.json         6 clinicians
│  ├─ posts.json           8 journal articles
│  ├─ gallery.json         18 gallery items
│  ├─ testimonials.json    Sample testimonials (isSample: true)
│  └─ faqs.json            Grouped FAQs
├─ scripts/
│  └─ generate-sitemap.mjs
├─ server/                 Express API
│  ├─ data/db.json         JSON fallback store (created at runtime)
│  └─ src/
│     ├─ config/           Environment loading
│     ├─ db/               Store, repository, connection
│     ├─ middleware/       Auth, CORS, rate limits, errors
│     ├─ routes/           auth, content, forms, admin
│     ├─ seed/             First-run seeding
│     ├─ utils/            HTTP helpers, date handling
│     ├─ validation/       Zod schemas
│     ├─ app.js
│     └─ index.js
├─ package.json            Root scripts (dev, build, seed, sitemap)
└─ README.md
```

---

## Requirements

- **Node.js 20+** (developed on Node 24)
- **npm 10+**
- **MongoDB** (optional) — a local instance or an Atlas connection string

---

## Quick start

```bash
# 1. Install dependencies for the root, API and client
npm run install:all

# 2. Create the API environment file
#    Windows (PowerShell)
Copy-Item server/.env.example server/.env
#    macOS / Linux
cp server/.env.example server/.env

# 3. Edit server/.env — at minimum set JWT_SECRET and a new ADMIN_PASSWORD

# 4. Start API + client together
npm run dev
```

- Public site: <http://localhost:5173>
- API: <http://localhost:4000/api>
- Admin: <http://localhost:5173/admin>

The Vite dev server proxies `/api` to `http://localhost:4000`, so no client-side URL
configuration is required in development.

### Running the two processes separately

```bash
npm run dev:server     # API only, with --watch
npm run dev:client     # Vite only
```

---

## Environment variables

All variables live in `server/.env` (never committed). See `server/.env.example`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | API port |
| `NODE_ENV` | `development` | `production` enables stricter cookie and logging behaviour |
| `MONGODB_URI` | _(blank)_ | Mongo connection string. Blank ⇒ JSON fallback store |
| `JWT_SECRET` | dev fallback | **Required in production.** Long random signing secret |
| `JWT_EXPIRES_IN` | `7d` | Admin session lifetime |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed credentialed CORS origin |
| `ADMIN_EMAIL` | `admin@aureliadental.studio` | Seeded admin account |
| `ADMIN_PASSWORD` | `Admin@12345` | Seeded admin password — change before deployment |
| `ADMIN_NAME` | `Practice Manager` | Display name in the workspace |
| `SEED_DEMO_CONTENT` | `true` | Seed `content/*.json` into empty collections on boot |

Generate a signing secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Database behaviour

The API uses a small repository layer with two interchangeable backends:

1. **MongoDB** — used when `MONGODB_URI` is set and the connection succeeds.
2. **JSON file store** — `server/data/db.json`, used automatically when Mongo is unavailable.
   A warning is logged and the site keeps working. This is for demos and local development,
   **not** for production traffic.

On startup, empty collections are seeded from `content/*.json`, and an admin user is created
from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if no users exist. Existing data is never overwritten.

To re-seed deliberately:

```bash
npm run seed
```

> If you want a clean database, stop the API, delete `server/data/db.json` (fallback mode) or
> drop the Mongo database, then restart.

---

## Scripts

Run from the repository root:

| Command | Description |
| --- | --- |
| `npm run install:all` | Install root, server and client dependencies |
| `npm run dev` | Run API and Vite dev server concurrently |
| `npm run dev:server` | API only (`node --watch`) |
| `npm run dev:client` | Vite only |
| `npm run build` | Type-check and build the client to `client/dist` |
| `npm start` | Start the API in production mode |
| `npm run seed` | Seed content and the admin user |
| `npm run sitemap` | Regenerate `client/public/sitemap.xml` from `content/*.json` |
| `npm run typecheck` | TypeScript check without emitting |

Set `SITE_URL` when generating a sitemap for a different origin:

```bash
# PowerShell
$env:SITE_URL="https://www.your-domain.com"; npm run sitemap
```

---

## Admin workspace

1. Open <http://localhost:5173/admin>.
2. Sign in with the credentials from `server/.env`.

Development defaults (change these):

```
Email:    admin@aureliadental.studio
Password: Admin@12345
```

Behaviour worth knowing:

- Public appointment requests are always stored as **pending**. Only a staff member can
  confirm them.
- The public availability endpoint treats both pending and confirmed requests as blocking.
- Confirming a request does **not** email the patient — this build has no mail transport.
  Contact patients through your practice mailbox.
- Editing a treatment or clinician updates the public site immediately (the client fetches live
  data and falls back to bundled JSON if the API is unreachable).

---

## Editing content

- **Editorial copy:** edit the JSON files in `content/`, then re-seed or edit through the admin.
  These files are the seed source and the client-side fallback.
- **Brand, contact details, hours, social links, booking copy:** `client/src/config/site.ts`.
  This is the single place to rebrand the site.
- **Colour palette and typography:** `client/tailwind.config.js` and `client/src/index.css`.
- **Images:** place files in `client/public/images/` and reference them as `/images/<file>`.
- **FAQs and testimonials:** `content/faqs.json`, `content/testimonials.json` (testimonials are
  flagged `isSample: true` and rendered with a disclosure).

---

## SEO

- Every page sets its own title, description, canonical URL, Open Graph and Twitter metadata
  via `client/src/lib/seo.ts`.
- Structured data (Dentist / Article / FAQPage / BreadcrumbList) is injected per page.
- `client/public/robots.txt` disallows `/admin` and points at the sitemap.
- `client/public/sitemap.xml` contains all public routes, treatments, clinicians and articles.
  Regenerate it with `npm run sitemap` after content changes and set `SITE_URL` first.
- Replace the placeholder domain `https://www.aureliadental.studio` in `robots.txt`,
  `client/index.html` and the sitemap script before launch.

---

## Security notes

Implemented:

- bcrypt password hashing (cost 12) with timing-equalised login for unknown accounts
- JWT stored in an httpOnly, sameSite cookie; `secure` in production
- Protected admin routes on both the API and the client
- Zod validation on every write endpoint
- Rate limiting: forms 20/15 min, auth 12/15 min, API 600/15 min
- Helmet security headers, explicit CORS allow-list, JSON body size limit
- Honeypot field on public forms
- No secrets in source; environment-driven configuration

Before going live:

1. Set a strong `JWT_SECRET` and change `ADMIN_PASSWORD`.
2. Serve over HTTPS and set `NODE_ENV=production` (enables secure cookies).
3. Point `CLIENT_ORIGIN` at the real frontend origin.
4. Use MongoDB (or another managed database), not the JSON fallback.
5. Add a mail provider if you want confirmation emails.
6. Review data-retention and consent wording with the practice's compliance adviser.

---

## Deployment checklist

- [ ] Replace placeholder clinic name, address, phone, email and social links in `site.ts`
- [ ] Replace clinician profiles, qualifications and photographs with verified details
- [ ] Replace sample testimonials and illustrative gallery images with consented material
- [ ] Review fees, opening hours and treatment claims
- [ ] Set production environment variables and a unique admin password
- [ ] Configure MongoDB and take a backup
- [ ] Build the client (`npm run build`) and serve `client/dist` behind your web server
- [ ] Reverse-proxy `/api` to the Express server and enable HTTPS
- [ ] Update the sitemap domain and submit it to search engines
- [ ] Test the appointment flow, contact form and admin login on the live domain

---

## Troubleshooting

**The site loads but admin login fails**
Ensure the API is running on port 4000 and `server/.env` exists. Check the API log for
`MongoDB unavailable` warnings — the fallback store still works, but the data file must be
writable.

**“Invalid credentials” with the documented password**
The admin user is only seeded when no users exist. If you changed `ADMIN_PASSWORD` after the
first run, the old hash remains. Delete `server/data/db.json` (fallback) or the `users`
collection (Mongo), then restart to re-seed.

**Images return 404**
Only files referenced from `client/public/images` are bundled. Add the file and use a path
beginning with `/images/`.

**Sitemap is out of date**
Run `npm run sitemap` (optionally with `SITE_URL` set) after editing content.

**Port already in use**
Change `PORT` in `server/.env`, or stop the process using 4000/5173.

---

© 2026 Aurelia Dental Studio Ltd — demonstration project. Replace all placeholder content
before publication.
