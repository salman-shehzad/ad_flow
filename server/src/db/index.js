const postgres = require('./postgres');

const db = {
  query: postgres.query,
  getClient: postgres.getClient,
};

module.exports = db;
