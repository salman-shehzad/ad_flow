const router = require('express').Router();
const c = require('../controllers/publicController');
router.get('/ads', c.listAds);
router.get('/ads/:id', c.getAd);
module.exports = router;
