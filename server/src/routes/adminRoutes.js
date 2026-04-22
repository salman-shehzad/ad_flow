import { Router } from "express";
import { adminController } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { adminPublishSchema, paymentReviewSchema } from "../validations.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("admin", "super_admin"));
router.get("/payment-queue", asyncHandler(adminController.paymentQueue));
router.get("/ads/ready", asyncHandler(adminController.readyAds));
router.get("/users", asyncHandler(adminController.users));
router.patch(
  "/payments/:id/verify",
  validate(paymentReviewSchema),
  asyncHandler(adminController.verifyPayment),
);
router.patch(
  "/ads/:id/publish",
  validate(adminPublishSchema),
  asyncHandler(adminController.publishAd),
);
router.get("/analytics", asyncHandler(adminController.analytics));

export default router;
