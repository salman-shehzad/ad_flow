const adService = require('../services/adService');

async function queue(req, res, next) { try { res.json(await adService.moderatorQueue()); } catch (e) { next(e); } }
async function review(req, res, next) { try { await adService.moderatorReview(req.user.id, Number(req.params.id), !!req.body.approved, req.body.note); res.json({ ok: true }); } catch (e) { next(e); } }

module.exports = { queue, review };
