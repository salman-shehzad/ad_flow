const router = require('express').Router();
const c = require('../controllers/adminController');
const { authRequired, allowRoles } = require('../middleware/auth');
router.use(authRequired, allowRoles('admin', 'super_admin'));
router.get('/payment-queue', c.paymentQueue);
router.patch('/payments/:id/verify', c.verify);
router.patch('/ads/:id/publish', c.publish);
router.get('/analytics', c.analytics);
module.exports = router;
