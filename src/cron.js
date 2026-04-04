const cron = require('node-cron');
const db = require('./data');
const { STATES } = require('./workflow');
const adService = require('./services/adService');

function publishScheduledAds(now = Date.now()) {
  const due = db.ads.filter((ad) => ad.state === STATES.SCHEDULED && ad.scheduledAt && ad.scheduledAt <= now);
  due.forEach((ad) => adService.publishNow(ad.id));
  return due.length;
}

function expireOutdatedAds(now = Date.now()) {
  const toExpire = db.ads.filter((ad) => ad.state === STATES.PUBLISHED && ad.expiresAt && ad.expiresAt <= now);
  toExpire.forEach((ad) => adService.transitionAd(ad.id, STATES.EXPIRED));
  return toExpire.length;
}

function sendExpiryNotifications() {
  const expired = db.ads.filter((ad) => ad.state === STATES.EXPIRED && !ad.expiryNotifiedAt);
  expired.forEach((ad) => {
    db.notifications.push({
      id: `notif-${ad.id}`,
      userId: ad.ownerId,
      type: 'ad_expired',
      message: `Ad '${ad.title}' has expired.`,
      createdAt: Date.now()
    });
    ad.expiryNotifiedAt = Date.now();
  });
  return expired.length;
}

function monitorDatabaseHealth() {
  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    action: 'db_health_check',
    details: {
      ads: db.ads.length,
      payments: db.payments.length,
      notifications: db.notifications.length
    },
    at: Date.now()
  });
  return true;
}

function registerCronJobs() {
  cron.schedule('*/1 * * * *', () => publishScheduledAds());
  cron.schedule('*/2 * * * *', () => expireOutdatedAds());
  cron.schedule('*/5 * * * *', () => sendExpiryNotifications());
  cron.schedule('*/10 * * * *', () => monitorDatabaseHealth());
}

module.exports = {
  registerCronJobs,
  publishScheduledAds,
  expireOutdatedAds,
  sendExpiryNotifications,
  monitorDatabaseHealth
};
