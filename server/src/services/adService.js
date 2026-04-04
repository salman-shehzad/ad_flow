const db = require('../db');
const { AD_STATUS, PAYMENT_STATUS } = require('../../../shared/constants');
const { rankScore } = require('../utils/ranking');
const { normalizeMedia } = require('../utils/media');

async function changeStatus(adId, toStatus, changedBy, note = '') {
  const cur = await db.query('SELECT status FROM ads WHERE id=$1', [adId]);
  if (!cur.rows[0]) throw { status: 404, message: 'Ad not found' };
  const from = cur.rows[0].status;
  await db.query('UPDATE ads SET status=$1, updated_at=NOW() WHERE id=$2', [toStatus, adId]);
  await db.query('INSERT INTO ad_status_history(ad_id,from_status,to_status,changed_by,note) VALUES ($1,$2,$3,$4,$5)', [adId, from, toStatus, changedBy, note]);
}

async function createAd(userId, payload) {
  const status = payload.submit ? AD_STATUS.SUBMITTED : AD_STATUS.DRAFT;
  const ad = await db.query(
    `INSERT INTO ads (user_id,title,description,category_id,city_id,status,publish_at,expire_at,package_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [userId, payload.title, payload.description, payload.categoryId, payload.cityId, status, payload.publishAt || null, payload.expireAt || null, payload.packageId],
  );
  if (payload.mediaUrl) {
    const media = normalizeMedia(payload.mediaUrl);
    await db.query('INSERT INTO ad_media(ad_id,source_type,original_url,thumbnail_url,validation_status) VALUES ($1,$2,$3,$4,$5)',
      [ad.rows[0].id, media.sourceType, payload.mediaUrl, media.thumbnailUrl, media.validationStatus]);
  }
  await db.query('INSERT INTO ad_status_history(ad_id,to_status,changed_by,note) VALUES ($1,$2,$3,$4)', [ad.rows[0].id, status, userId, 'created']);
  return ad.rows[0];
}

async function updateAd(userId, adId, payload) {
  const adRes = await db.query('SELECT * FROM ads WHERE id=$1 AND user_id=$2', [adId, userId]);
  const ad = adRes.rows[0];
  if (!ad) throw { status: 404, message: 'Ad not found' };
  if (ad.status !== AD_STATUS.DRAFT && ad.status !== AD_STATUS.SUBMITTED) throw { status: 400, message: 'Ad can no longer be edited' };
  await db.query('UPDATE ads SET title=$1, description=$2, category_id=$3, city_id=$4, updated_at=NOW() WHERE id=$5',
    [payload.title || ad.title, payload.description || ad.description, payload.categoryId || ad.category_id, payload.cityId || ad.city_id, adId]);
  if (payload.submit && ad.status === AD_STATUS.DRAFT) await changeStatus(adId, AD_STATUS.SUBMITTED, userId, 'submitted by client');
  return (await db.query('SELECT * FROM ads WHERE id=$1', [adId])).rows[0];
}

async function submitPayment(userId, payload) {
  const adRes = await db.query('SELECT * FROM ads WHERE id=$1 AND user_id=$2', [payload.adId, userId]);
  const ad = adRes.rows[0];
  if (!ad) throw { status: 404, message: 'Ad not found' };
  if (ad.status !== AD_STATUS.PAYMENT_PENDING) throw { status: 400, message: 'Ad is not ready for payment' };
  const p = await db.query('INSERT INTO payments(ad_id,amount,transaction_ref,screenshot_url,status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [payload.adId, payload.amount, payload.transactionRef, payload.screenshotUrl, PAYMENT_STATUS.SUBMITTED]);
  await changeStatus(ad.id, AD_STATUS.PAYMENT_SUBMITTED, userId, 'payment submitted');
  return p.rows[0];
}

async function publicAds(filters) {
  const result = await db.query(
    `SELECT a.*, p.weight, p.is_featured, c.name category_name, ci.name city_name
     FROM ads a
     JOIN packages p ON p.id=a.package_id
     JOIN categories c ON c.id=a.category_id
     JOIN cities ci ON ci.id=a.city_id
     WHERE a.status=$1 AND (a.expire_at IS NULL OR a.expire_at > NOW())`,
    [AD_STATUS.PUBLISHED],
  );
  let rows = result.rows;
  if (filters.q) rows = rows.filter((r) => `${r.title} ${r.description}`.toLowerCase().includes(filters.q.toLowerCase()));
  if (filters.cityId) rows = rows.filter((r) => String(r.city_id) === String(filters.cityId));
  rows.forEach((r) => { r.rank_score = rankScore(r); });
  rows.sort((a, b) => b.rank_score - a.rank_score);
  return rows;
}

async function moderatorQueue() {
  const result = await db.query('SELECT * FROM ads WHERE status=$1 ORDER BY created_at ASC', [AD_STATUS.SUBMITTED]);
  return result.rows;
}

async function moderatorReview(actorId, adId, approved, note) {
  if (approved) {
    await changeStatus(adId, AD_STATUS.UNDER_REVIEW, actorId, 'picked for review');
    await changeStatus(adId, AD_STATUS.PAYMENT_PENDING, actorId, note || 'approved by moderator');
    return;
  }
  await changeStatus(adId, AD_STATUS.DRAFT, actorId, note || 'rejected by moderator');
}

async function paymentQueue() {
  const result = await db.query('SELECT p.*, a.title FROM payments p JOIN ads a ON a.id=p.ad_id WHERE p.status=$1', [PAYMENT_STATUS.SUBMITTED]);
  return result.rows;
}

async function verifyPayment(actorId, paymentId, approved) {
  const pRes = await db.query('SELECT * FROM payments WHERE id=$1', [paymentId]);
  const payment = pRes.rows[0];
  if (!payment) throw { status: 404, message: 'Payment not found' };
  const newStatus = approved ? PAYMENT_STATUS.VERIFIED : PAYMENT_STATUS.REJECTED;
  await db.query('UPDATE payments SET status=$1 WHERE id=$2', [newStatus, paymentId]);
  if (approved) await changeStatus(payment.ad_id, AD_STATUS.PAYMENT_VERIFIED, actorId, 'payment verified');
}

async function publishAd(actorId, adId, scheduleAt) {
  const ad = (await db.query('SELECT * FROM ads WHERE id=$1', [adId])).rows[0];
  if (!ad) throw { status: 404, message: 'Ad not found' };
  if (ad.status !== AD_STATUS.PAYMENT_VERIFIED && ad.status !== AD_STATUS.SCHEDULED) throw { status: 400, message: 'Payment verification required before publishing' };
  if (scheduleAt && new Date(scheduleAt) > new Date()) {
    await db.query('UPDATE ads SET publish_at=$1 WHERE id=$2', [scheduleAt, adId]);
    await changeStatus(adId, AD_STATUS.SCHEDULED, actorId, 'scheduled publish');
  } else {
    await db.query("UPDATE ads SET publish_at=COALESCE(publish_at,NOW()), expire_at=COALESCE(expire_at, NOW() + interval '30 day') WHERE id=$1", [adId]);
    await changeStatus(adId, AD_STATUS.PUBLISHED, actorId, 'published');
  }
}

async function clientDashboard(userId) {
  const ads = await db.query('SELECT * FROM ads WHERE user_id=$1 ORDER BY created_at DESC', [userId]);
  const payments = await db.query('SELECT p.* FROM payments p JOIN ads a ON p.ad_id=a.id WHERE a.user_id=$1 ORDER BY p.created_at DESC', [userId]);
  return { ads: ads.rows, payments: payments.rows };
}

async function analytics() {
  const totalAds = Number((await db.query('SELECT COUNT(*) AS count FROM ads')).rows[0].count);
  const activeAds = Number((await db.query('SELECT COUNT(*) AS count FROM ads WHERE status=$1 AND (expire_at IS NULL OR expire_at > NOW())', [AD_STATUS.PUBLISHED])).rows[0].count);
  const revenueByPackage = (await db.query(`SELECT pa.name, COALESCE(SUM(pay.amount),0) AS revenue
    FROM packages pa
    LEFT JOIN ads a ON a.package_id=pa.id
    LEFT JOIN payments pay ON pay.ad_id=a.id AND pay.status='verified'
    GROUP BY pa.name ORDER BY revenue DESC`)).rows;
  const approvalRate = (await db.query(`SELECT COALESCE(ROUND((SUM(CASE WHEN status IN ('Payment Pending','Payment Verified','Scheduled','Published','Expired') THEN 1 ELSE 0 END)::decimal / NULLIF(COUNT(*),0))*100,2),0) AS rate FROM ads`)).rows[0].rate;
  return { totalAds, activeAds, revenueByPackage, approvalRate };
}

async function runPublishCron() {
  await db.query('UPDATE ads SET status=$1 WHERE status=$2 AND publish_at <= NOW()', [AD_STATUS.PUBLISHED, AD_STATUS.SCHEDULED]);
}

async function runExpireCron() {
  await db.query('UPDATE ads SET status=$1 WHERE status=$2 AND expire_at <= NOW()', [AD_STATUS.EXPIRED, AD_STATUS.PUBLISHED]);
}

module.exports = {
  createAd,
  updateAd,
  submitPayment,
  publicAds,
  moderatorQueue,
  moderatorReview,
  paymentQueue,
  verifyPayment,
  publishAd,
  clientDashboard,
  analytics,
  runPublishCron,
  runExpireCron,
};
