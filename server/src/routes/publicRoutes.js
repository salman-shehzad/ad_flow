import { Router } from "express";
import { publicController } from "../controllers/publicController.js";
import { validate } from "../middleware/validate.js";
import { publicAdsQuerySchema } from "../validations.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/ads", validate(publicAdsQuerySchema, "query"), asyncHandler(publicController.listAds));
router.get("/ads/:id", asyncHandler(publicController.getAd));
router.get("/packages", asyncHandler(publicController.packages));
router.get("/filters", asyncHandler(publicController.filters));

export default router;
