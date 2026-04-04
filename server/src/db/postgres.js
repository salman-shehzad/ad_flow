const { Pool } = require('pg');
const env = require('../config/env');

const pool = new Pool({ connectionString: env.dbUrl });

async function query(text, params = []) {
  return pool.query(text, params);
}

async function getClient() {
  return pool.connect();
}

module.exports = { query, getClient, pool };
