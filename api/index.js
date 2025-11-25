const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initDatabase, pool, getAllQuestions } = require('../backend/models/db');
const quizRoutes = require('../backend/routes/quiz');
const commentRoutes = require('../backend/routes/comments');
const seedRoute = require('./seed');
const quizQuestions = require('../backend/seeds/quizData');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

// CORS configuration - allow all origins in production if no specific origins set
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
  : {
      origin: true, // Allow all origins when no specific origins configured
      credentials: true,
    };

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

// API Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/seed', seedRoute);

// Health check with database state verification
app.get('/api/health', async (req, res) => {
  try {
    // Basic health check
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        seeded: false,
        questionCount: 0
      }
    };

    // Check database connection and state
    try {
      await ensureDatabaseReady();
      health.database.connected = true;

      // Check if questions exist
      const questions = await getAllQuestions();
      const expectedCount = quizQuestions.length;
      health.database.questionCount = questions.length;
      health.database.expectedCount = expectedCount;
      health.database.seeded = questions.length > 0;
      health.database.fullySeeded = questions.length === expectedCount;

      if (questions.length === 0) {
        health.status = 'warning';
        health.message = 'Database is connected but not seeded. No questions found.';
      } else if (questions.length < expectedCount) {
        health.status = 'warning';
        health.message = `Database is partially seeded. Found ${questions.length} of ${expectedCount} expected questions.`;
      } else {
        health.message = `Database is healthy. ${questions.length} question(s) available.`;
      }
    } catch (dbError) {
      health.status = 'error';
      health.database.connected = false;
      health.message = `Database connection failed: ${dbError.message}`;
      health.error = dbError.message;
    }

    const statusCode = health.status === 'error' ? 503 : health.status === 'warning' ? 200 : 200;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Test endpoint to verify routing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API routing is working!',
    path: req.path,
    url: req.url,
    method: req.method
  });
});

// Serve static files from frontend/dist (only for non-API routes)
const staticMiddleware = express.static(path.join(__dirname, '../frontend/dist'));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // Skip static serving for API routes
  }
  staticMiddleware(req, res, next);
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    // API route not found - return 404 JSON
    return res.status(404).json({ message: 'API route not found' });
  }
  // Serve React app for all other routes
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Fallback error handler for consistent JSON responses (must be last)
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

// Export for Vercel serverless function
// Vercel expects the handler to be the default export
module.exports = app;
module.exports.default = app;

