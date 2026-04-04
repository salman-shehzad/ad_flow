const { v4: uuid } = require('uuid');
const db = require('../data');
const { STATES, assertTransition } = require('../workflow');

function getPackage(packageId) {
  const pkg = db.packages.find((p) => p.id === packageId);
  if (!pkg) throw new Error('Invalid package');
  return pkg;
}

function rankScore(ad) {
  const pkg = getPackage(ad.packageId);
  const freshness = Math.max(0, 72 - (Date.now() - ad.createdAt) / (1000 * 60 * 60));
  return (ad.featured ? 100 : 0) + pkg.weight + freshness + (ad.adminBoost || 0);
}

function listPublicAds(filters = {}) {
  return db.ads
    .filter((ad) => ad.state === STATES.PUBLISHED)
    .filter((ad) => (filters.city ? ad.city === filters.city : true))
    .filter((ad) => (filters.category ? ad.category === filters.category : true))
    .sort((a, b) => rankScore(b) - rankScore(a));
}

function createDraft(input, ownerId) {
  const ad = {
    id: uuid(),
    title: input.title,
    city: input.city,
    category: input.category,
    packageId: input.packageId,
    ownerId,
    price: input.price,
    mediaUrls: input.mediaUrls,
    state: STATES.DRAFT,
    featured: false,
    adminBoost: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    scheduledAt: null,
    publishedAt: null,
    expiresAt: null,
    moderationNotes: null
  };
  db.ads.push(ad);
  return ad;
}

function transitionAd(adId, toState, extras = {}) {
  const ad = db.ads.find((a) => a.id === adId);
  if (!ad) throw new Error('Ad not found');
  assertTransition(ad.state, toState);
  ad.state = toState;
  ad.updatedAt = Date.now();
  Object.assign(ad, extras);
  return ad;
}

function maybeSetExpiry(ad) {
  if (!ad.publishedAt) return ad;
  const pkg = getPackage(ad.packageId);
  ad.expiresAt = ad.publishedAt + pkg.durationDays * 24 * 60 * 60 * 1000;
  return ad;
}

function publishNow(adId) {
  const ad = transitionAd(adId, STATES.PUBLISHED, { publishedAt: Date.now(), scheduledAt: null });
  return maybeSetExpiry(ad);
}

function schedulePublish(adId, scheduledAt) {
  return transitionAd(adId, STATES.SCHEDULED, { scheduledAt });
}

function listByOwner(ownerId) {
  return db.ads.filter((ad) => ad.ownerId === ownerId);
}

module.exports = {
  rankScore,
  listPublicAds,
  createDraft,
  transitionAd,
  publishNow,
  schedulePublish,
  listByOwner,
  maybeSetExpiry,
  getPackage
};
