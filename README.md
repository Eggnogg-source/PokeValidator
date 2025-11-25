# Pokemon Comparison Quiz Full Stack Application

Comparisons are personal! This project leans into that with a full-stack Pokémon quiz where players pick which mon reigns supreme within each category. The backend uses Express + PostgreSQL and pulls live stats/abilities from PokéAPI. The frontend (Vite + React) renders rich comparison cards, locks answers, tracks hidden score, and shows a results screen with shareable screenshots. Every pick also unlocks a public comment thread so players can defend their choice.

## Features

### Quiz Flow
- Dedicated start screen explaining the point system (Super Valid → Hell No).
- Categories can contain 2–5 Pokémon (Generations, Legendary groupings, Guardian deities, etc).
- Each Pokémon card shows:
  - Official artwork
  - Full base stats
  - Ability name + effect text
  - Up to three alternate forms (Therian, Altered, etc) when available.
- Choosing a Pokémon:
  - Locks the row, displays result dialogue specific to that mon (Valid, Understandable, No, Hell No…).
  - Reveals a comment form tied to the Pokémon + category.
- “Next Question” button advances sequentially; final step shows a loading screen before results.

### Score & Results
- Hidden point system with five grading tiers:
  - **Super Valid** (+15)
  - **Valid** (+10)
  - **Understandable** (+5)
  - **No** (-10)
  - **Hell No** (-20)
- Final percentage converts to themed verdict text (“YOU ARE… Valid”, “Cool!”, “Eeeh!”, “Way too close, 6 feet bub.”).
- Results screen provides:
  - Screenshot button (html2canvas)
  - Quick restart to rules screen (full reset)
  - Navigation to “Full Results” detail view (per question breakdown).

### Comment System
- Public feed per category/Pokémon with commenter name + timestamp.
- Comments are color-coded based on the Pokémon they support.
- Supports addition & deletion via Express routes; stored in PostgreSQL.
- Frontend auto-refreshes the list after actions.

### Data Integration
- **PokéAPI** fetcher handles:
  - Name variations (incarnate/therian, altered/origin, etc.)
  - Species fallback if direct fetch fails.
  - Ability descriptions via effect entries.
  - Alternate form sprites (dream world, official artwork, fallback to default).
- Server caches nothing (always live) to keep builds simple, but code is structured so caching could be added easily.

## Tech Stack

- **Frontend**: React 18 + Vite, axios, html2canvas.
- **Backend**: Node 20, Express 5, pg, cors, dotenv.
- **Database**: PostgreSQL (tested locally; works with Supabase/Railway/Vercel Postgres).
- **Deployment Targets**: Vercel (frontend + serverless backend) or any Node-compatible host.

## Project Structure
```
Full Stack App/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── quiz.js         # Quiz data + PokéAPI proxy
│   │   └── comments.js     # Comment CRUD (now includes deletion)
│   ├── models/
│   │   └── db.js           # Pool + helpers (init schema, comments, etc.)
│   ├── seeds/
│   │   ├── quizData.js     # Dialogue + scoring per Pokémon
│   │   └── seedDatabase.js
│   ├── scripts/
│   │   ├── createDatabase.js
│   │   └── updateSchema.js # Recreates tables with 5-Pokémon support
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── StartScreen.jsx
│   │   │   ├── QuizInterface.jsx
│   │   │   ├── PokemonOption.jsx
│   │   │   ├── FeedbackDisplay.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── ResultsScreen.jsx
│   │   │   └── FullResultsView.jsx
│   └── package.json
├── README.md
├── TESTING_GUIDE.md
└── .gitignore
```

## Setup & Environment

### Prerequisites
- Node.js 18+ (project uses fetch API in Node)
- PostgreSQL instance
- npm (or pnpm/yarn with adjusted commands)

### Backend Setup
```bash
cd backend
npm install
cp env.example .env   # include DB + optional CORS origins
```

`.env` needs:
```
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/pokemon_quiz
PORT=5000
# Comma-separated list (leave blank to allow any origin during local dev)
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://poke-validator.vercel.app
```

Initialize DB + seed data:
```bash
npm run update-schema   # Drops/recreates quiz_questions + comments with 5-slot schema
npm run seed            # Inserts all categories + dialogue
npm start               # Starts Express server
```

### Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
npm run dev
```

Vite dev server runs on http://localhost:5173 (hot reload).

## Testing Workflow
Please see `TESTING_GUIDE.md` for a command-by-command walkthrough. Highlights:
1. Create DB + run `npm run update-schema`
2. `npm run seed` to insert 23 questions (Legendaries included)
3. `npm start` backend
4. `npm run dev` frontend
5. Manual QA: quiz flow, comment add/delete, results, screenshot.

## Deployment Notes
- **Single Vercel deployment (frontend + backend)**:
  - `vercel.json` builds the Vite client with `@vercel/static-build` and the Express API through `@vercel/node`.
  - API requests hit `/api/*` which Vercel rewrites to the backend serverless function; the frontend is served from `/frontend/dist`.
  - The install step runs `npm install --prefix backend && npm install --prefix frontend`, so no root workspace setup is required.
  - Provide `DATABASE_URL`, optional `CORS_ALLOWED_ORIGINS`, and any custom `VITE_API_URL`/`VITE_DEV_API_URL` values through the Vercel dashboard.
- **Local preview**: `npm run dev` inside each package. The Vite dev server now proxies `/api` to `http://localhost:5000` (configurable via `VITE_DEV_API_URL`).
- **Other hosts**: Backend can still run as a traditional Node server (`node backend/server.js`); frontend build artifacts live under `frontend/dist` after `npm run build`.
- When using Vercel Postgres/Supabase, update `.env` accordingly and rerun `npm run update-schema && npm run seed`.

## Environment Variables

| Location   | Variable                | Purpose                                     |
|------------|-------------------------|---------------------------------------------|
| Backend    | `DATABASE_URL`          | PostgreSQL connection string                |
| Backend    | `PORT`                  | Express port (default 5000)                 |
| Backend    | `CORS_ALLOWED_ORIGINS`  | Whitelist domains for browser requests      |
| Frontend   | `VITE_API_URL`          | Base URL for API requests (prod fallback to `/api`) |
| Frontend   | `VITE_DEV_API_URL`      | Vite dev-server proxy target (default `http://localhost:5000`) |

## License
ISC

