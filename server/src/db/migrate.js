const fs = require('fs');
const path = require('path');
const db = require('./index');

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  await db.query(sql);
  console.log('Migration complete');
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
