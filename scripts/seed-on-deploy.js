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
      console.log(`✓ Database already has ${count} questions. Skipping seed.`);
      console.log('✓ Database is ready for use.');
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

    // Verification step: Confirm questions were actually inserted
    const verificationResult = await pool.query('SELECT COUNT(*) FROM quiz_questions');
    const verifiedCount = parseInt(verificationResult.rows[0].count);
    
    if (verifiedCount === 0) {
      throw new Error('Verification failed: No questions found in database after seeding');
    }
    
    if (verifiedCount !== insertedCount) {
      console.warn(`WARNING: Expected ${insertedCount} questions but found ${verifiedCount} in database`);
    }
    
    console.log(`✓ Verification passed: ${verifiedCount} questions confirmed in database`);
    console.log('✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR SEEDING DATABASE:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('\n⚠️  WARNING: Database seeding failed during build.');
    console.error('⚠️  The build will continue, but the database may be empty.');
    console.error('⚠️  You may need to manually seed the database after deployment.');
    console.error('⚠️  Use the /api/seed endpoint or run: npm run seed\n');
    // Exit with 0 to not fail the build, but make the error very visible
    process.exit(0);
  }
};

// Only run if any database URL is set (supports custom prefixes)
const hasDatabaseUrl = 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.STORAGE_URL || 
  process.env.STORAGE_URL_NON_POOLING ||
  process.env.DATABASE_URL;

if (hasDatabaseUrl) {
  seedOnDeploy().catch((error) => {
    console.error('Fatal error in seed-on-deploy:', error);
    process.exit(0); // Don't fail build, but log error
  });
} else {
  console.log('⚠️  No database URL found. Skipping seed.');
  console.log('⚠️  Database will need to be seeded manually after deployment.');
  process.exit(0);
}

