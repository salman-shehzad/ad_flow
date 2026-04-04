const adService = require('../services/adService');

async function paymentQueue(req, res, next) { try { res.json(await adService.paymentQueue()); } catch (e) { next(e); } }
async function verify(req, res, next) { try { await adService.verifyPayment(req.user.id, Number(req.params.id), !!req.body.approved); res.json({ ok: true }); } catch (e) { next(e); } }
async function publish(req, res, next) { try { await adService.publishAd(req.user.id, Number(req.params.id), req.body.scheduleAt); res.json({ ok: true }); } catch (e) { next(e); } }
async function analytics(req, res, next) { try { res.json(await adService.analytics()); } catch (e) { next(e); } }

module.exports = { paymentQueue, verify, publish, analytics };
