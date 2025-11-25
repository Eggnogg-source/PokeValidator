const { Client } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
  // Connect to default postgres database to create our database
  const client = new Client({
    user: 'Christian',
    password: 'Noga814',
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'pokemon_quiz'"
    );

    if (result.rows.length === 0) {
      // Create the database
      await client.query('CREATE DATABASE pokemon_quiz');
      console.log('Database "pokemon_quiz" created successfully!');
    } else {
      console.log('Database "pokemon_quiz" already exists.');
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('Error creating database:', error.message);
    process.exit(1);
  }
};

createDatabase();

