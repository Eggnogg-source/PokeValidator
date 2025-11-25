const { pool, initDatabase } = require('../backend/models/db');
const quizQuestions = require('../backend/seeds/quizData');

const seedOnDeploy = async () => {
  try {
    console.log('Starting automatic database seed on deploy...');
    
    // Initialize database schema
    await initDatabase();
    console.log('Database schema initialized');

    // Check if questions already exist
    const existingQuestions = await pool.query('SELECT COUNT(*) FROM quiz_questions');
    const count = parseInt(existingQuestions.rows[0].count);

    if (count > 0) {
      console.log(`Database already has ${count} questions. Skipping seed.`);
      process.exit(0);
    }

    console.log('No questions found. Seeding database...');

    // Insert quiz questions
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

    console.log(`Successfully seeded ${insertedCount} questions!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    // Don't fail the build if seeding fails - just log it
    console.log('Continuing deployment despite seed error...');
    process.exit(0);
  }
};

// Only run if DATABASE_URL or POSTGRES_URL is set
if (process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL) {
  seedOnDeploy();
} else {
  console.log('No database URL found. Skipping seed.');
  process.exit(0);
}

