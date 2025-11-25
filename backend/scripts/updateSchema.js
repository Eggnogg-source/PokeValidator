const { pool } = require('../models/db');
require('dotenv').config();

const updateSchema = async () => {
  try {
    console.log('Updating database schema to support 5 Pokemon...');

    // Drop the existing table and recreate with new schema
    await pool.query('DROP TABLE IF EXISTS comments CASCADE');
    await pool.query('DROP TABLE IF EXISTS quiz_questions CASCADE');

    // Recreate quiz_questions table with pokemon5 support
    await pool.query(`
      CREATE TABLE quiz_questions (
        id SERIAL PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        pokemon_count INTEGER NOT NULL CHECK (pokemon_count IN (2, 3, 4, 5)),
        pokemon1_name VARCHAR(255) NOT NULL,
        pokemon1_image_url TEXT,
        pokemon1_dialogue TEXT NOT NULL,
        pokemon1_result_type VARCHAR(20) NOT NULL CHECK (pokemon1_result_type IN ('super_valid', 'valid', 'understandable', 'no', 'hell_no')),
        pokemon2_name VARCHAR(255) NOT NULL,
        pokemon2_image_url TEXT,
        pokemon2_dialogue TEXT NOT NULL,
        pokemon2_result_type VARCHAR(20) NOT NULL CHECK (pokemon2_result_type IN ('super_valid', 'valid', 'understandable', 'no', 'hell_no')),
        pokemon3_name VARCHAR(255),
        pokemon3_image_url TEXT,
        pokemon3_dialogue TEXT,
        pokemon3_result_type VARCHAR(20) CHECK (pokemon3_result_type IN ('super_valid', 'valid', 'understandable', 'no', 'hell_no')),
        pokemon4_name VARCHAR(255),
        pokemon4_image_url TEXT,
        pokemon4_dialogue TEXT,
        pokemon4_result_type VARCHAR(20) CHECK (pokemon4_result_type IN ('super_valid', 'valid', 'understandable', 'no', 'hell_no')),
        pokemon5_name VARCHAR(255),
        pokemon5_image_url TEXT,
        pokemon5_dialogue TEXT,
        pokemon5_result_type VARCHAR(20) CHECK (pokemon5_result_type IN ('super_valid', 'valid', 'understandable', 'no', 'hell_no')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Recreate comments table
    await pool.query(`
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
        pokemon_name VARCHAR(255) NOT NULL,
        commenter_name VARCHAR(255) NOT NULL,
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database schema updated successfully!');
    console.log('Now run: npm run seed');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
};

updateSchema();

