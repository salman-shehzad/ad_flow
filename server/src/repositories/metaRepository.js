export const metaRepository = {
  async listCategories(db) {
    const { rows } = await db.query("SELECT * FROM categories ORDER BY name ASC");
    return rows;
  },

  async listCities(db) {
    const { rows } = await db.query("SELECT * FROM cities ORDER BY name ASC");
    return rows;
  },

  async listPackages(db) {
    const { rows } = await db.query("SELECT * FROM packages ORDER BY price ASC");
    return rows;
  },

  async findPackageById(db, id) {
    const { rows } = await db.query("SELECT * FROM packages WHERE id = $1", [id]);
    return rows[0] || null;
  },
};
