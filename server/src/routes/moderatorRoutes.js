import { Router } from "express";
import { moderatorController } from "../controllers/moderatorController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { moderationReviewSchema } from "../validations.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("moderator", "admin", "super_admin"));
router.get("/review-queue", asyncHandler(moderatorController.queue));
router.patch("/ads/:id/review", validate(moderationReviewSchema), asyncHandler(moderatorController.review));

export default router;
