export const usersRepository = {
  async create(db, payload) {
    const { rows } = await db.query(
      `INSERT INTO users (name, email, username, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, username, role, created_at`,
      [payload.name, payload.email, payload.username || null, payload.passwordHash, payload.role],
    );
    return rows[0];
  },

  async findByEmail(db, email) {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0] || null;
  },

  async findByIdentifier(db, identifier) {
    const { rows } = await db.query(
      "SELECT * FROM users WHERE email = $1 OR LOWER(username) = LOWER($1)",
      [identifier],
    );
    return rows[0] || null;
  },

  async findById(db, id) {
    const { rows } = await db.query(
      "SELECT id, name, email, username, role, created_at FROM users WHERE id = $1",
      [id],
    );
    return rows[0] || null;
  },

  async listAll(db) {
    const { rows } = await db.query(
      `SELECT id, name, email, username, role, created_at
       FROM users
       ORDER BY created_at DESC, id DESC`,
    );
    return rows;
  },

  async update(db, id, payload) {
    const fields = [];
    const values = [];

    if (payload.name !== undefined) {
      values.push(payload.name);
      fields.push(`name = $${values.length}`);
    }

    if (payload.email !== undefined) {
      values.push(payload.email);
      fields.push(`email = $${values.length}`);
    }

    if (payload.username !== undefined) {
      values.push(payload.username);
      fields.push(`username = $${values.length}`);
    }

    if (payload.role !== undefined) {
      values.push(payload.role);
      fields.push(`role = $${values.length}`);
    }

    if (payload.passwordHash !== undefined) {
      values.push(payload.passwordHash);
      fields.push(`password_hash = $${values.length}`);
    }

    if (fields.length === 0) {
      return this.findById(db, id);
    }

    values.push(id);
    const { rows } = await db.query(
      `UPDATE users
       SET ${fields.join(", ")}
       WHERE id = $${values.length}
       RETURNING id, name, email, username, role, created_at`,
      values,
    );
    return rows[0] || null;
  },

  async delete(db, id) {
    const { rows } = await db.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING id, name, email, username, role, created_at`,
      [id],
    );
    return rows[0] || null;
  },
};
