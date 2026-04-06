import { moderationService } from "../services/moderationService.js";

export const moderatorController = {
  async queue(_req, res) {
    const data = await moderationService.getReviewQueue();
    res.json(data);
  },

  async review(req, res) {
    const ad = await moderationService.reviewAd(req.user.id, Number(req.params.id), req.body);
    res.json(ad);
  },
};
