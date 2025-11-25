const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDatabase } = require('./models/db');
const quizRoutes = require('./routes/quiz');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

const corsOptions = allowedOrigins.length
  ? {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
    }
  : undefined;

// Ensure we only run the database bootstrap once per runtime (useful for serverless).
let dbInitPromise;
const ensureDatabaseReady = () => {
  if (!dbInitPromise) {
    dbInitPromise = initDatabase().catch((error) => {
      dbInitPromise = null;
      throw error;
    });
  }
  return dbInitPromise;
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(async (req, res, next) => {
  try {
    await ensureDatabaseReady();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/comments', commentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Fallback error handler for consistent JSON responses
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('API error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// Initialize database and start server locally
const startServer = async () => {
  try {
    await ensureDatabaseReady();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.handler = app;
