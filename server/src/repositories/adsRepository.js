import { PAGINATION_LIMIT } from "../../../shared/index.js";

const adSelect = `
  SELECT
    ads.*,
    users.name AS owner_name,
    users.email AS owner_email,
    categories.name AS category_name,
    cities.name AS city_name,
    packages.name AS package_name,
    packages.duration_days,
    packages.weight AS package_weight,
    packages.price AS package_price,
    packages.is_featured,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', ad_media.id,
          'source_type', ad_media.source_type,
          'original_url', ad_media.original_url,
          'thumbnail_url', ad_media.thumbnail_url,
          'validation_status', ad_media.validation_status
        )
      ) FILTER (WHERE ad_media.id IS NOT NULL),
      '[]'::json
    ) AS media
  FROM ads
  JOIN users ON users.id = ads.user_id
  LEFT JOIN categories ON categories.id = ads.category_id
  LEFT JOIN cities ON cities.id = ads.city_id
  LEFT JOIN packages ON packages.id = ads.package_id
  LEFT JOIN ad_media ON ad_media.ad_id = ads.id
`;

const adGroupBy = `
  GROUP BY ads.id, users.name, users.email, categories.name, cities.name,
           packages.name, packages.duration_days, packages.weight,
           packages.price, packages.is_featured
`;

export const adsRepository = {
  async create(db, payload) {
    const { rows } = await db.query(
      `INSERT INTO ads (
        user_id, title, description, category_id, city_id, status, publish_at, expire_at, package_id, admin_boost
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        payload.userId,
        payload.title,
        payload.description,
        payload.categoryId,
        payload.cityId,
        payload.status,
        payload.publishAt,
        payload.expireAt,
        payload.packageId,
        payload.adminBoost || 0,
      ],
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
      `UPDATE ads SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${index} RETURNING *`,
      values,
    );
    return rows[0] || null;
  },

  async findById(db, id) {
    const { rows } = await db.query(`${adSelect} WHERE ads.id = $1 ${adGroupBy}`, [id]);
    return rows[0] || null;
  },

  async findOwnedByUser(db, id, userId) {
    const { rows } = await db.query(
      `${adSelect} WHERE ads.id = $1 AND ads.user_id = $2 ${adGroupBy}`,
      [id, userId],
    );
    return rows[0] || null;
  },

  async replaceMedia(db, adId, mediaItems) {
    await db.query("DELETE FROM ad_media WHERE ad_id = $1", [adId]);

    for (const media of mediaItems) {
      await db.query(
        `INSERT INTO ad_media (ad_id, source_type, original_url, thumbnail_url, validation_status)
         VALUES ($1, $2, $3, $4, $5)`,
        [adId, media.sourceType, media.originalUrl, media.thumbnailUrl, media.validationStatus],
      );
    }
  },

  async insertStatusHistory(db, payload) {
    await db.query(
      `INSERT INTO ad_status_history (ad_id, old_status, new_status, changed_by, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [payload.adId, payload.oldStatus, payload.newStatus, payload.changedBy, payload.note || null],
    );
  },

  async listForPublic(db, filters) {
    const clauses = ["ads.status = 'Published'", "(ads.expire_at IS NULL OR ads.expire_at > NOW())"];
    const values = [];
    let index = 1;

    if (filters.search) {
      clauses.push(`(ads.title ILIKE $${index} OR ads.description ILIKE $${index})`);
      values.push(`%${filters.search}%`);
      index += 1;
    }

    if (filters.categoryId) {
      clauses.push(`ads.category_id = $${index}`);
      values.push(filters.categoryId);
      index += 1;
    }

    if (filters.cityId) {
      clauses.push(`ads.city_id = $${index}`);
      values.push(filters.cityId);
      index += 1;
    }

    values.push(filters.limit || PAGINATION_LIMIT);

    const orderClause = `
      ORDER BY (
        CASE WHEN packages.is_featured THEN 50 ELSE 0 END +
        COALESCE(packages.weight, 0) * 10 +
        GREATEST(0, 30 - EXTRACT(DAY FROM NOW() - ads.created_at)) +
        COALESCE(ads.admin_boost, 0)
      ) DESC,
      ads.created_at DESC
    `;

    const { rows } = await db.query(
      `${adSelect}
       WHERE ${clauses.join(" AND ")}
       ${adGroupBy}
       ${orderClause}
       LIMIT $${index}`,
      values,
    );

    return rows;
  },

  async listForReviewQueue(db) {
    const { rows } = await db.query(
      `${adSelect}
       WHERE ads.status IN ('Submitted', 'Under Review')
       ${adGroupBy}
       ORDER BY ads.created_at ASC`,
    );
    return rows;
  },

  async listForOwner(db, userId) {
    const { rows } = await db.query(
      `${adSelect}
       WHERE ads.user_id = $1
       ${adGroupBy}
       ORDER BY ads.updated_at DESC`,
      [userId],
    );
    return rows;
  },

  async listReadyForPublish(db) {
    const { rows } = await db.query(
      `${adSelect}
       WHERE ads.status = 'Payment Verified'
       ${adGroupBy}
       ORDER BY ads.updated_at DESC`,
    );
    return rows;
  },

  async listScheduledForPublish(db) {
    const { rows } = await db.query(
      "SELECT * FROM ads WHERE status = 'Scheduled' AND publish_at <= NOW() AND (expire_at IS NULL OR expire_at > NOW())",
    );
    return rows;
  },

  async listForExpiry(db) {
    const { rows } = await db.query(
      "SELECT * FROM ads WHERE status IN ('Published', 'Scheduled') AND expire_at IS NOT NULL AND expire_at <= NOW()",
    );
    return rows;
  },
};
