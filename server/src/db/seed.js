const bcrypt = require('bcryptjs');
const db = require('./index');
const { AD_STATUS } = require('../../../shared/constants');

(async () => {
  await db.query('DELETE FROM ad_status_history; DELETE FROM audit_logs; DELETE FROM notifications; DELETE FROM ad_media; DELETE FROM payments; DELETE FROM ads; DELETE FROM packages; DELETE FROM categories; DELETE FROM cities; DELETE FROM users;');

  const hash = await bcrypt.hash('password123', 10);
  const users = await db.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES
    ('Client User','client@adflow.test',$1,'client'),
    ('Moderator User','moderator@adflow.test',$1,'moderator'),
    ('Admin User','admin@adflow.test',$1,'admin'),
    ('Super Admin','super@adflow.test',$1,'super_admin')
    RETURNING *`,
    [hash],
  );

  await db.query("INSERT INTO categories(name) VALUES ('Real Estate'), ('Cars'), ('Jobs'), ('Electronics'), ('Services')");
  await db.query("INSERT INTO cities(name) VALUES ('New York'), ('Los Angeles'), ('Chicago'), ('Houston'), ('Miami')");
  await db.query(`INSERT INTO packages(name,duration_days,weight,price,is_featured) VALUES
    ('Basic',7,1,19.99,false),
    ('Standard',15,3,59.99,false),
    ('Premium',30,5,129.99,true)`);

  for (let i = 1; i <= 15; i++) {
    const st = i <= 8 ? AD_STATUS.PUBLISHED : i <= 11 ? AD_STATUS.SCHEDULED : AD_STATUS.SUBMITTED;
    const ad = await db.query(
      `INSERT INTO ads (user_id,title,description,category_id,city_id,status,publish_at,expire_at,package_id,admin_boost)
       VALUES ($1,$2,$3,$4,$5,$6,NOW() - interval '1 day', NOW() + interval '10 day', $7, $8) RETURNING id`,
      [users.rows[0].id, `Sample Ad ${i}`, `Description for sample ad ${i}`, ((i - 1) % 5) + 1, ((i - 1) % 5) + 1, st, ((i - 1) % 3) + 1, i % 2],
    );
    await db.query('INSERT INTO ad_media (ad_id,source_type,original_url,thumbnail_url,validation_status) VALUES ($1,$2,$3,$4,$5)', [ad.rows[0].id, 'image', `https://picsum.photos/seed/ad${i}/600/400`, null, 'valid']);
    await db.query('INSERT INTO ad_status_history(ad_id,to_status,changed_by,note) VALUES ($1,$2,$3,$4)', [ad.rows[0].id, st, users.rows[2].id, 'seed']);
  }

  console.log('Seed complete');
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
