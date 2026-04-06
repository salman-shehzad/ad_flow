export const analyticsRepository = {
  async getSnapshot(db) {
    const totalAds = await db.query("SELECT COUNT(*)::int AS value FROM ads");
    const activeAds = await db.query(
      "SELECT COUNT(*)::int AS value FROM ads WHERE status = 'Published' AND (expire_at IS NULL OR expire_at > NOW())",
    );
    const revenueByPackage = await db.query(
      `SELECT COALESCE(packages.name, 'Unassigned') AS package_name, COALESCE(SUM(payments.amount), 0) AS revenue
       FROM payments
       LEFT JOIN ads ON ads.id = payments.ad_id
       LEFT JOIN packages ON packages.id = ads.package_id
       WHERE payments.status = 'verified'
       GROUP BY packages.name
       ORDER BY revenue DESC`,
    );
    const approvalRate = await db.query(
      `SELECT
         CASE
           WHEN COUNT(*) FILTER (WHERE status IN ('Payment Pending', 'Payment Submitted', 'Payment Verified', 'Scheduled', 'Published', 'Expired')) = 0
           THEN 0
           ELSE ROUND(
             100.0 * COUNT(*) FILTER (WHERE status IN ('Scheduled', 'Published', 'Expired', 'Payment Verified')) /
             COUNT(*) FILTER (WHERE status IN ('Payment Pending', 'Payment Submitted', 'Payment Verified', 'Scheduled', 'Published', 'Expired')),
             2
           )
         END AS value
       FROM ads`,
    );

    return {
      totalAds: totalAds.rows[0].value,
      activeAds: activeAds.rows[0].value,
      revenueByPackage: revenueByPackage.rows,
      approvalRate: Number(approvalRate.rows[0].value),
    };
  },
};
