const connectToPg = async () => {
  if (global.connection) return global.connection.connect();

  const { Pool } = require('pg');
  const config = {
    user: 'postgres',
    host: 'konsist-api-web.cqzslig58guu.sa-east-1.rds.amazonaws.com',
    database: 'konsistweb',
    password: 'juizladrao_1994',
    port: 5432,
  };
  const pool = new Pool(config);

  const client = await pool.connect();
  console.log('Criou pool de conexões no PostgreSQL!');

  global.connection = pool;
  return pool.connect();
};

connectToPg();

module.exports = { connectToPg };
