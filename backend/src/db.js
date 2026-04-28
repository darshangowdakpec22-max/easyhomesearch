const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT NOW()');
    console.log('Database connected at', rows[0].now);
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}

module.exports = { pool, testConnection };
