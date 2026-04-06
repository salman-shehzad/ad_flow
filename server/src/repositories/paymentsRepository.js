export const paymentsRepository = {
  async create(db, payload) {
    const { rows } = await db.query(
      `INSERT INTO payments (ad_id, amount, transaction_ref, screenshot_url, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [payload.adId, payload.amount, payload.transactionRef, payload.screenshotUrl, payload.status],
    );
    return rows[0];
  },

  async update(db, id, payload) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(payload)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index += 1;
    }

    values.push(id);

    const { rows } = await db.query(
      `UPDATE payments SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${index} RETURNING *`,
      values,
    );
    return rows[0] || null;
  },

  async findById(db, id) {
    const { rows } = await db.query(
      `SELECT payments.*, ads.title AS ad_title, ads.status AS ad_status, ads.user_id, packages.name AS package_name
       FROM payments
       JOIN ads ON ads.id = payments.ad_id
       LEFT JOIN packages ON packages.id = ads.package_id
       WHERE payments.id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  async findLatestByAdId(db, adId) {
    const { rows } = await db.query(
      "SELECT * FROM payments WHERE ad_id = $1 ORDER BY created_at DESC LIMIT 1",
      [adId],
    );
    return rows[0] || null;
  },

  async listQueue(db) {
    const { rows } = await db.query(
      `SELECT payments.*, ads.title AS ad_title, users.name AS owner_name, packages.name AS package_name
       FROM payments
       JOIN ads ON ads.id = payments.ad_id
       JOIN users ON users.id = ads.user_id
       LEFT JOIN packages ON packages.id = ads.package_id
       WHERE payments.status = 'submitted'
       ORDER BY payments.created_at ASC`,
    );
    return rows;
  },
};
