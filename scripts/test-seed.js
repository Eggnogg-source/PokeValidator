const { pool, initDatabase } = require('../backend/models/db');
const quizQuestions = require('../backend/seeds/quizData');

const testSeed = async () => {
  try {
    console.log('🧪 Testing database seeding...\n');
    
    // Check for database URL
    const hasDatabaseUrl = 
      process.env.POSTGRES_URL || 
      process.env.POSTGRES_URL_NON_POOLING || 
      process.env.STORAGE_URL || 
      process.env.STORAGE_URL_NON_POOLING ||
      process.env.DATABASE_URL;

    if (!hasDatabaseUrl) {
      console.error('❌ ERROR: No database URL found in environment variables.');
      console.error('   Please set one of: POSTGRES_URL, DATABASE_URL, STORAGE_URL');
      process.exit(1);
    }

    console.log('✓ Database URL found');
    console.log('✓ Connecting to database...\n');

    // Initialize database schema
    await initDatabase();
    console.log('✓ Database schema initialized\n');

    // Check if questions already exist
    const existingQuestions = await pool.query('SELECT COUNT(*) FROM quiz_questions');
    const count = parseInt(existingQuestions.rows[0].count);

    if (count > 0) {
      console.log(`✓ Database already has ${count} questions`);
      console.log('✓ Database is ready for use\n');
      
      // Verify we have the expected number
      if (count >= quizQuestions.length) {
        console.log(`✓ Expected at least ${quizQuestions.length} questions, found ${count}`);
        console.log('✅ TEST PASSED: Database is properly seeded\n');
        process.exit(0);
      } else {
        console.log(`⚠️  WARNING: Expected ${quizQuestions.length} questions but found ${count}`);
        console.log('   Re-seeding to ensure all questions are present...\n');
        // Continue to seed below
      }
    } else {
      console.log('⚠️  No questions found. Seeding database...\n');
    }

    // Clear existing questions for clean test
    await pool.query('DELETE FROM quiz_questions');
    console.log('✓ Cleared existing quiz questions\n');

    // Insert quiz questions
    let insertedCount = 0;
    console.log(`Inserting ${quizQuestions.length} questions...`);
    
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
      if (insertedCount % 5 === 0 || insertedCount === quizQuestions.length) {
        process.stdout.write(`\r  Progress: ${insertedCount}/${quizQuestions.length} questions inserted...`);
      }
    }
    console.log('\n');

    // Verification step: Confirm questions were actually inserted
    console.log('✓ Verifying database state...');
    const verificationResult = await pool.query('SELECT COUNT(*) FROM quiz_questions');
    const verifiedCount = parseInt(verificationResult.rows[0].count);
    
    if (verifiedCount === 0) {
      throw new Error('Verification failed: No questions found in database after seeding');
    }
    
    if (verifiedCount !== insertedCount) {
      throw new Error(`Verification failed: Expected ${insertedCount} questions but found ${verifiedCount}`);
    }
    
    if (verifiedCount !== quizQuestions.length) {
      throw new Error(`Verification failed: Expected ${quizQuestions.length} questions but found ${verifiedCount}`);
    }
    
    console.log(`✓ Verification passed: ${verifiedCount} questions confirmed in database`);
    console.log(`✓ All ${quizQuestions.length} questions successfully inserted\n`);
    
    // Test query to ensure questions can be retrieved
    const testQuery = await pool.query('SELECT id, category_name FROM quiz_questions ORDER BY id LIMIT 5');
    console.log('✓ Sample questions retrieved:');
    testQuery.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. [ID: ${row.id}] ${row.category_name}`);
    });
    
    console.log('\n✅ TEST PASSED: Database seeding works correctly!');
    console.log('✅ Ready for deployment\n');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    console.error('\n❌ Database seeding test failed. Do not deploy until this is fixed.\n');
    
    try {
      await pool.end();
    } catch (closeError) {
      // Ignore close errors
    }
    
    process.exit(1);
  }
};

testSeed();

