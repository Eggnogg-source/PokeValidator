const express = require('express');
const { pool, initDatabase } = require('../backend/models/db');
const quizQuestions = require('../backend/seeds/quizData');

const app = express();
app.use(express.json());

// Secure seed endpoint - requires secret key
app.post('/', async (req, res) => {
  try {
    // Check for secret key (set in Vercel environment variables)
    const providedKey = req.headers['x-seed-key'] || req.body.seedKey;
    const expectedKey = process.env.SEED_SECRET_KEY || 'change-me-in-production';

    if (providedKey !== expectedKey) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid seed key. Set SEED_SECRET_KEY environment variable.'
      });
    }

    console.log('Starting database initialization and seed...');

    // Step 1: Initialize database schema (creates tables if they don't exist)
    await initDatabase();
    console.log('Database schema initialized');

    // Step 2: Clear existing questions
    await pool.query('DELETE FROM quiz_questions');
    console.log('Cleared existing quiz questions');

    // Step 3: Insert quiz questions
    let insertedCount = 0;
    const errors = [];
    
    for (const question of quizQuestions) {
      try {
        const {
          category_name,
          pokemon_count,
          pokemon1_name,
          pokemon1_dialogue,
          pokemon1_result_type,
          pokemon2_name,
          pokemon2_dialogue,
          pokemon2_result_type,
          pokemon3_name,
          pokemon3_dialogue,
          pokemon3_result_type,
          pokemon4_name,
          pokemon4_dialogue,
          pokemon4_result_type,
          pokemon5_name,
          pokemon5_dialogue,
          pokemon5_result_type,
        } = question;

        await pool.query(
          `INSERT INTO quiz_questions (
            category_name, pokemon_count,
            pokemon1_name, pokemon1_image_url, pokemon1_dialogue, pokemon1_result_type,
            pokemon2_name, pokemon2_image_url, pokemon2_dialogue, pokemon2_result_type,
            pokemon3_name, pokemon3_image_url, pokemon3_dialogue, pokemon3_result_type,
            pokemon4_name, pokemon4_image_url, pokemon4_dialogue, pokemon4_result_type,
            pokemon5_name, pokemon5_image_url, pokemon5_dialogue, pokemon5_result_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
          [
            category_name,
            pokemon_count,
            pokemon1_name,
            null,
            pokemon1_dialogue,
            pokemon1_result_type,
            pokemon2_name,
            null,
            pokemon2_dialogue,
            pokemon2_result_type,
            pokemon3_name || null,
            null,
            pokemon3_dialogue || null,
            pokemon3_result_type || null,
            pokemon4_name || null,
            null,
            pokemon4_dialogue || null,
            pokemon4_result_type || null,
            pokemon5_name || null,
            null,
            pokemon5_dialogue || null,
            pokemon5_result_type || null
          ]
        );

        insertedCount++;
        console.log(`Inserted question: ${category_name}`);
      } catch (questionError) {
        const errorMsg = `Failed to insert question "${question.category_name}": ${questionError.message}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    // Step 4: Verification
    const verificationResult = await pool.query('SELECT COUNT(*) FROM quiz_questions');
    const verifiedCount = parseInt(verificationResult.rows[0].count);

    if (verifiedCount === 0) {
      throw new Error('Verification failed: No questions found in database after seeding. The seeding process may have failed.');
    }

    if (verifiedCount !== insertedCount) {
      console.warn(`Warning: Expected ${insertedCount} questions but found ${verifiedCount} in database`);
    }

    const response = {
      success: true,
      message: verifiedCount === quizQuestions.length 
        ? 'Database seeded successfully! All questions verified.' 
        : `Database seeded with ${verifiedCount} questions (expected ${quizQuestions.length}).`,
      questionsInserted: insertedCount,
      questionsVerified: verifiedCount,
      totalQuestions: quizQuestions.length,
      verification: {
        passed: verifiedCount === quizQuestions.length,
        expected: quizQuestions.length,
        found: verifiedCount
      }
    };

    if (errors.length > 0) {
      response.warnings = errors;
      response.message += ` ${errors.length} question(s) failed to insert.`;
    }

    res.json(response);
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed database',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET endpoint to check database state (no auth required for checking)
app.get('/', async (req, res) => {
  try {
    await initDatabase();
    const result = await pool.query('SELECT COUNT(*) FROM quiz_questions');
    const count = parseInt(result.rows[0].count);
    const expectedCount = quizQuestions.length;

    res.json({
      seeded: count > 0,
      questionCount: count,
      expectedCount: expectedCount,
      status: count === expectedCount ? 'complete' : count > 0 ? 'partial' : 'empty',
      message: count === 0 
        ? 'Database is empty. Seeding required.'
        : count === expectedCount
        ? 'Database is fully seeded.'
        : `Database has ${count} of ${expectedCount} questions.`
    });
  } catch (error) {
    console.error('Error checking database state:', error);
    res.status(500).json({
      error: 'Failed to check database state',
      message: error.message
    });
  }
});

// Export for Vercel serverless function
module.exports = app;

