const { Pool } = require('pg');
require('dotenv').config();

// Use POSTGRES_URL (Vercel's default) or fallback to DATABASE_URL
const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database schema
const initDatabase = async () => {
  try {
    // Create quiz_questions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
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

    // Create comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
        pokemon_name VARCHAR(255) NOT NULL,
        commenter_name VARCHAR(255) NOT NULL,
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get all quiz questions
const getAllQuestions = async () => {
  const result = await pool.query('SELECT * FROM quiz_questions ORDER BY id');
  return result.rows;
};

// Get a specific question by ID
const getQuestionById = async (id) => {
  const result = await pool.query('SELECT * FROM quiz_questions WHERE id = $1', [id]);
  return result.rows[0];
};

// Get comments for a specific Pokemon in a question
const getComments = async (questionId, pokemonName) => {
  const result = await pool.query(
    'SELECT * FROM comments WHERE question_id = $1 AND pokemon_name = $2 ORDER BY created_at DESC',
    [questionId, pokemonName]
  );
  return result.rows;
};

// Get all comments for a question (shared pool)
const getAllCommentsForQuestion = async (questionId) => {
  const result = await pool.query(
    'SELECT * FROM comments WHERE question_id = $1 ORDER BY created_at DESC',
    [questionId]
  );
  return result.rows;
};

// Add a comment
const addComment = async (questionId, pokemonName, commenterName, commentText) => {
  const result = await pool.query(
    'INSERT INTO comments (question_id, pokemon_name, commenter_name, comment_text) VALUES ($1, $2, $3, $4) RETURNING *',
    [questionId, pokemonName, commenterName, commentText]
  );
  return result.rows[0];
};

// Delete a comment
const deleteComment = async (commentId) => {
  const result = await pool.query(
    'DELETE FROM comments WHERE id = $1 RETURNING *',
    [commentId]
  );
  return result.rows[0];
};

module.exports = {
  pool,
  initDatabase,
  getAllQuestions,
  getQuestionById,
  getComments,
  getAllCommentsForQuestion,
  addComment,
  deleteComment
};

