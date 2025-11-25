# Testing Guide

## 1. Database Setup

1. Ensure PostgreSQL is running.
2. Create database if it does not exist:
   ```sql
   CREATE DATABASE pokemon_quiz;
   ```
3. Copy `backend/.env.example` to `.env` and set credentials:
   ```
   DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/pokemon_quiz
   PORT=5000
   ```

## 2. Initialize Schema & Seed Data
From `backend/`:
```bash
npm install
npm run update-schema   # drops & recreates quiz_questions/comments with 5-Pokémon schema
npm run seed            # inserts all categories + dialogue (expect “Successfully seeded 23 questions!”)
```

## 3. Start Backend
```bash
npm start
```
Server listens on http://localhost:5000 and logs each PokéAPI fetch (helpful for debugging missing forms).

## 4. Start Frontend
In a new terminal:
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```
Frontend runs on http://localhost:5173.

## 5. Manual Test Plan
1. **Start Screen**: Verify rules + scoring summary, click “Start Quiz”.
2. **Question Flow** (repeat for multiple categories):
   - Check that all Pokémon cards load with stats, abilities, alternate forms.
   - Select each Pokémon once to confirm dialogue + results banner unlock.
   - Post a comment (name + argument), ensure it appears instantly.
   - Delete the comment to confirm new delete endpoint works.
   - Proceed via “Next Question”.
3. **Results Screen**:
   - Observe loading screen message (“After this, the designs get a lot more boring…”).
   - Confirm final percentage, verdict text, screenshot button, full results navigation, restart.
4. **Full Results View**: Validate list of questions with selected Pokémon + dialogue.
5. **Restart**: Use “Back to Start” to ensure state resets (score, answers, comments input).

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| `error: database "pokemon_quiz" does not exist` | Run `CREATE DATABASE pokemon_quiz;` then rerun `npm run update-schema` |
| PokéAPI fetch fails for Tornadus/Giratina | Restart backend; check console logs for “Pokemon not found” entries |
| Comments not deleting | Ensure backend restarted with latest routes; confirm DELETE request returns 200 |
| Vite cannot reach API | Verify `VITE_API_URL` matches backend URL and CORS is enabled (`server.js` uses `cors()`) |
| Ports in use | Stop existing Node processes or set different `PORT`/`VITE_API_URL` |

## 7. Suggested Automated Checks (optional)
- `npm run lint` (if configured)
- API smoke tests via Postman/Thunder Client:
  - `GET /api/quiz/question/1`
  - `POST /api/comments`
  - `DELETE /api/comments/:id`
