import { AD_STATUSES } from "../../../shared/index.js";
import { db } from "../config/db.js";
import { adsRepository } from "../repositories/adsRepository.js";
import { auditRepository } from "../repositories/auditRepository.js";
import { buildStatusSequence } from "./workflowService.js";
import { ApiError } from "../utils/apiError.js";

export const moderationService = {
  async getReviewQueue() {
    return adsRepository.listForReviewQueue(db);
  },

  async reviewAd(actorUserId, adId, payload) {
    const ad = await adsRepository.findById(db, adId);
    if (!ad) {
      throw new ApiError(404, "Ad not found");
    }

    if (![AD_STATUSES.SUBMITTED, AD_STATUSES.UNDER_REVIEW].includes(ad.status)) {
      throw new ApiError(400, "Ad is not in the moderation queue");
    }

    const statuses = buildStatusSequence(ad.status, payload.approved ? AD_STATUSES.PAYMENT_PENDING : AD_STATUSES.REJECTED);
    let currentStatus = ad.status;
    for (const status of statuses) {
      await adsRepository.update(db, adId, { status });
      await adsRepository.insertStatusHistory(db, {
        adId,
        oldStatus: currentStatus,
        newStatus: status,
        changedBy: actorUserId,
        note: payload.note,
      });
      currentStatus = status;
    }

    await auditRepository.create(db, {
      actorUserId,
      entityType: "ad",
      entityId: adId,
      action: payload.approved ? "moderation_approved" : "moderation_rejected",
      metadata: { note: payload.note || null },
    });

    await auditRepository.notify(db, {
      userId: ad.user_id,
      title: payload.approved ? "Ad approved for payment" : "Ad rejected",
      message: payload.approved
        ? `${ad.title} passed moderation and is ready for payment.`
        : `${ad.title} was rejected. ${payload.note || "Please revise and resubmit."}`,
    });

    return adsRepository.findById(db, adId);
  },
};
