const router = require('express').Router();
const c = require('../controllers/moderatorController');
const { authRequired, allowRoles } = require('../middleware/auth');
router.use(authRequired, allowRoles('moderator', 'admin', 'super_admin'));
router.get('/review-queue', c.queue);
router.patch('/ads/:id/review', c.review);
module.exports = router;
