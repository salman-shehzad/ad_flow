export const auditRepository = {
  async create(db, payload) {
    await db.query(
      `INSERT INTO audit_logs (actor_user_id, entity_type, entity_id, action, metadata)
       VALUES ($1, $2, $3, $4, $5::jsonb)`,
      [payload.actorUserId, payload.entityType, payload.entityId, payload.action, JSON.stringify(payload.metadata || {})],
    );
  },

  async notify(db, payload) {
    await db.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [payload.userId, payload.title, payload.message],
    );
  },
};
