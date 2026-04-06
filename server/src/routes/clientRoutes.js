import { Router } from "express";
import { clientController } from "../controllers/clientController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { adCreateSchema, adUpdateSchema, paymentSchema } from "../validations.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("client"));
router.post("/ads", validate(adCreateSchema), asyncHandler(clientController.createAd));
router.patch("/ads/:id", validate(adUpdateSchema), asyncHandler(clientController.updateAd));
router.post("/payments", validate(paymentSchema), asyncHandler(clientController.submitPayment));
router.get("/dashboard", asyncHandler(clientController.dashboard));

export default router;
