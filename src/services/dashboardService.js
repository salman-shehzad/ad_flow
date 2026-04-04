const db = require('../data');
const { STATES } = require('../workflow');
const { rankScore } = require('./adService');

function clientDashboard(userId) {
  const myAds = db.ads.filter((ad) => ad.ownerId === userId);
  return {
    total: myAds.length,
    published: myAds.filter((a) => a.state === STATES.PUBLISHED).length,
    pendingReview: myAds.filter((a) => [STATES.SUBMITTED, STATES.UNDER_REVIEW].includes(a.state)).length,
    paymentPending: myAds.filter((a) => [STATES.PAYMENT_PENDING, STATES.PAYMENT_SUBMITTED].includes(a.state)).length,
    ads: myAds
  };
}

function moderatorDashboard() {
  const queue = db.ads.filter((ad) => [STATES.SUBMITTED, STATES.UNDER_REVIEW].includes(ad.state));
  return {
    queueSize: queue.length,
    queue
  };
}

function adminDashboard() {
  const pendingVerification = db.payments.filter((p) => p.status === 'submitted');
  const scheduledAds = db.ads.filter((a) => a.state === STATES.SCHEDULED);
  return {
    pendingPayments: pendingVerification.length,
    scheduledAds: scheduledAds.length,
    payments: pendingVerification,
    schedules: scheduledAds
  };
}

function analyticsDashboard() {
  const published = db.ads.filter((a) => a.state === STATES.PUBLISHED);
  const revenueByPackage = db.payments.filter((p) => p.status === 'verified').reduce((acc, payment) => {
    const ad = db.ads.find((a) => a.id === payment.adId);
    if (!ad) return acc;
    acc[ad.packageId] = (acc[ad.packageId] || 0) + payment.amount;
    return acc;
  }, {});

  const approvalRate = (() => {
    const reviewed = db.ads.filter((a) => [STATES.PAYMENT_PENDING, STATES.REJECTED, STATES.PUBLISHED, STATES.EXPIRED, STATES.ARCHIVED].includes(a.state));
    if (reviewed.length === 0) return 0;
    const approved = reviewed.filter((a) => a.state !== STATES.REJECTED).length;
    return Number(((approved / reviewed.length) * 100).toFixed(2));
  })();

  return {
    totalAds: db.ads.length,
    activeListings: published.length,
    topRankedAds: published.map((a) => ({ id: a.id, title: a.title, score: rankScore(a) })).sort((a, b) => b.score - a.score),
    revenueByPackage,
    approvalRate,
    byCategory: db.ads.reduce((acc, ad) => ({ ...acc, [ad.category]: (acc[ad.category] || 0) + 1 }), {}),
    byCity: db.ads.reduce((acc, ad) => ({ ...acc, [ad.city]: (acc[ad.city] || 0) + 1 }), {})
  };
}

module.exports = {
  clientDashboard,
  moderatorDashboard,
  adminDashboard,
  analyticsDashboard
};
