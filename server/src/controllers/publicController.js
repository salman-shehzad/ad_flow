const adService = require('../services/adService');
const db = require('../db');

async function listAds(req, res, next) {
  try { res.json(await adService.publicAds(req.query)); } catch (e) { next(e); }
}

async function getAd(req, res, next) {
  try {
    const ad = (await db.query('SELECT * FROM ads WHERE id=$1 AND status=$2 AND (expire_at IS NULL OR expire_at > NOW())', [req.params.id, 'Published'])).rows[0];
    if (!ad) return res.status(404).json({ message: 'Not found' });
    res.json(ad);
  } catch (e) { next(e); }
}

module.exports = { listAds, getAd };
