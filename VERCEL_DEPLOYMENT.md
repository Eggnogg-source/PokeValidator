# Vercel Deployment Guide

## Environment Variables

Set these in your Vercel project dashboard (Settings → Environment Variables):

### Required Variables

1. **DATABASE_URL** (or POSTGRES_URL)
   - PostgreSQL connection string
   - If using Vercel Postgres: `POSTGRES_URL` is automatically set when you add the database
   - If using external database: `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE`
   - Example: `postgresql://user:pass@db.example.com:5432/pokemon_quiz`

2. **SEED_SECRET_KEY** (optional but recommended)
   - Secret key for manual database seeding via `/api/seed` endpoint
   - Set to a secure random string (e.g., generate with `openssl rand -hex 32`)
   - Defaults to `'change-me-in-production'` if not set

### Optional Variables

3. **CORS_ALLOWED_ORIGINS**
   - Comma-separated list of allowed origins for CORS
   - Example: `https://poke-validator.vercel.app,https://yourdomain.com`
   - If not set, all origins are allowed (for development)

4. **NODE_ENV**
   - Set to `production` for production deployments
   - Automatically set by Vercel, but can be explicitly set

## Deployment Process

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add all required variables in Vercel dashboard
3. **Deploy**: Vercel will automatically:
   - Run `npm install`
   - Run `npm run build` (builds frontend)
   - Run `npm run postbuild` (seeds database if empty)
   - Deploy `api/index.js` as serverless function
   - Serve static files from `frontend/dist`

## Post-Deployment Verification

### 1. Check Database Seeding

After deployment, verify the database was seeded:

```bash
# Check health endpoint
curl https://your-app.vercel.app/api/health

# Should return:
# {
#   "status": "ok",
#   "database": {
#     "connected": true,
#     "seeded": true,
#     "questionCount": 23
#   }
# }
```

### 2. Check Seed Status

```bash
# Check seed endpoint status (no auth required)
curl https://your-app.vercel.app/api/seed

# Should return:
# {
#   "seeded": true,
#   "questionCount": 23,
#   "expectedCount": 23,
#   "status": "complete"
# }
```

### 3. Manual Seeding (if needed)

If automatic seeding failed, manually seed the database:

```bash
# POST to /api/seed with secret key
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Content-Type: application/json" \
  -H "x-seed-key: YOUR_SEED_SECRET_KEY" \
  -d '{"seedKey": "YOUR_SEED_SECRET_KEY"}'

# Or use the body method:
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Content-Type: application/json" \
  -d '{"seedKey": "YOUR_SEED_SECRET_KEY"}'
```

## Troubleshooting

### Database Not Seeded

1. Check build logs in Vercel dashboard for seeding errors
2. Verify `DATABASE_URL` or `POSTGRES_URL` is set correctly
3. Check database connection (firewall, credentials)
4. Manually trigger seeding via `/api/seed` endpoint

### API Routes Not Working

1. Verify `api/index.js` exists and exports the Express app
2. Check Vercel function logs for errors
3. Ensure routes are prefixed with `/api/`

### Frontend Not Loading

1. Verify `npm run build` completed successfully
2. Check that `frontend/dist` directory exists
3. Verify static file serving in `api/index.js`

## Testing Before Deployment

Always run locally before pushing:

```bash
# Test database seeding
npm run test-seed

# Build and test locally
npm run build
npm start
```

Only push to GitHub if `npm run test-seed` passes successfully.

