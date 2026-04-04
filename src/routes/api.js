const express = require('express');
const { z } = require('zod');
const db = require('../data');
const { STATES } = require('../workflow');
const adService = require('../services/adService');
const paymentService = require('../services/paymentService');
const dashboardService = require('../services/dashboardService');

const router = express.Router();

const adCreateSchema = z.object({
  title: z.string().min(3),
  city: z.string().min(2),
  category: z.string().min(2),
  packageId: z.string().min(2),
  price: z.number().nonnegative(),
  mediaUrls: z.array(z.string().url()).min(1)
});

router.get('/health', (_req, res) => res.json({ ok: true, now: new Date().toISOString() }));

router.get('/ads', (req, res) => {
  const ads = adService.listPublicAds({ city: req.query.city, category: req.query.category });
  res.json({ items: ads });
});

router.post('/client/ads', (req, res, next) => {
  try {
    const parsed = adCreateSchema.parse(req.body);
    const ownerId = req.header('x-user-id') || 'u-client';
    const ad = adService.createDraft(parsed, ownerId);
    res.status(201).json(ad);
  } catch (err) {
    next(err);
  }
});

router.patch('/client/ads/:id/submit', (req, res, next) => {
  try {
    const ad = adService.transitionAd(req.params.id, STATES.SUBMITTED);
    adService.transitionAd(req.params.id, STATES.UNDER_REVIEW);
    res.json(ad);
  } catch (err) {
    next(err);
  }
});

router.patch('/moderator/ads/:id/decision', (req, res, next) => {
  try {
    const { approved, notes } = req.body;
    const targetState = approved ? STATES.PAYMENT_PENDING : STATES.REJECTED;
    const ad = adService.transitionAd(req.params.id, targetState, { moderationNotes: notes || null });
    res.json(ad);
  } catch (err) {
    next(err);
  }
});

router.post('/client/ads/:id/payments', (req, res, next) => {
  try {
    const amount = Number(req.body.amount || 0);
    const proofUrl = req.body.proofUrl;
    if (!proofUrl) throw new Error('proofUrl required');
    adService.transitionAd(req.params.id, STATES.PAYMENT_SUBMITTED);
    const payment = paymentService.submitPayment(req.params.id, amount, proofUrl);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/payments/:id/verify', (req, res, next) => {
  try {
    const adminId = req.header('x-user-id') || 'u-admin';
    const payment = paymentService.verifyPayment(req.params.id, adminId);
    adService.transitionAd(payment.adId, STATES.PAYMENT_VERIFIED);
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/ads/:id/schedule', (req, res, next) => {
  try {
    const scheduleAt = new Date(req.body.scheduledAt).getTime();
    if (Number.isNaN(scheduleAt)) throw new Error('Invalid scheduledAt');
    const ad = adService.schedulePublish(req.params.id, scheduleAt);
    res.json(ad);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/ads/:id/publish', (req, res, next) => {
  try {
    const ad = adService.publishNow(req.params.id);
    res.json(ad);
  } catch (err) {
    next(err);
  }
});

router.get('/moderator/review-queue', (_req, res) => {
  res.json(dashboardService.moderatorDashboard());
});

router.get('/dashboards/client', (req, res) => {
  const userId = req.header('x-user-id') || 'u-client';
  res.json(dashboardService.clientDashboard(userId));
});

router.get('/dashboards/admin', (_req, res) => {
  res.json(dashboardService.adminDashboard());
});

router.get('/dashboards/analytics', (_req, res) => {
  res.json(dashboardService.analyticsDashboard());
});

router.get('/meta/workflow', (_req, res) => {
  res.json({
    states: Object.values(STATES),
    packages: db.packages,
    roles: db.users.map((u) => u.role)
  });
});

module.exports = router;
