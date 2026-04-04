const router = require('express').Router();
const c = require('../controllers/clientController');
const { authRequired, allowRoles } = require('../middleware/auth');
router.use(authRequired, allowRoles('client'));
router.post('/ads', c.createAd);
router.patch('/ads/:id', c.updateAd);
router.post('/payments', c.submitPayment);
router.get('/dashboard', c.dashboard);
module.exports = router;
