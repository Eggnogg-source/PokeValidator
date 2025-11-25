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
    for (const question of quizQuestions) {
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
    }

    res.json({
      success: true,
      message: `Database seeded successfully!`,
      questionsInserted: insertedCount,
      totalQuestions: quizQuestions.length
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      error: 'Failed to seed database',
      message: error.message
    });
  }
});

// Export for Vercel serverless function
module.exports = app;

