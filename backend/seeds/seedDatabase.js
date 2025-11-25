const { pool } = require('../models/db');
const quizQuestions = require('./quizData');

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Clear existing questions (optional - comment out if you want to keep existing data)
    await pool.query('DELETE FROM quiz_questions');

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
          null, // pokemon1_image_url - will be fetched from PokeAPI
          pokemon1_dialogue,
          pokemon1_result_type,
          pokemon2_name,
          null, // pokemon2_image_url
          pokemon2_dialogue,
          pokemon2_result_type,
          pokemon3_name || null,
          null, // pokemon3_image_url
          pokemon3_dialogue || null,
          pokemon3_result_type || null,
          pokemon4_name || null,
          null, // pokemon4_image_url
          pokemon4_dialogue || null,
          pokemon4_result_type || null,
          pokemon5_name || null,
          null, // pokemon5_image_url
          pokemon5_dialogue || null,
          pokemon5_result_type || null
        ]
      );

      console.log(`Inserted question: ${category_name}`);
    }

    console.log(`Successfully seeded ${quizQuestions.length} questions!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

