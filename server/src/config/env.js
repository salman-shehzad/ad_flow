const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const env = {
  port: Number(process.env.SERVER_PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  dbUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/adflow_pro',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

module.exports = env;
