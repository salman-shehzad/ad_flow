import { AD_STATUSES, PAYMENT_STATUSES } from "../../../shared/index.js";
import { db } from "../config/db.js";
import { adsRepository } from "../repositories/adsRepository.js";
import { analyticsRepository } from "../repositories/analyticsRepository.js";
import { auditRepository } from "../repositories/auditRepository.js";
import { paymentsRepository } from "../repositories/paymentsRepository.js";
import { ApiError } from "../utils/apiError.js";

export const adminService = {
  async getPaymentQueue() {
    return paymentsRepository.listQueue(db);
  },

  async getReadyAds() {
    return adsRepository.listReadyForPublish(db);
  },

  async verifyPayment(actorUserId, paymentId, payload) {
    const payment = await paymentsRepository.findById(db, paymentId);
    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    if (payment.status !== PAYMENT_STATUSES.SUBMITTED) {
      throw new ApiError(400, "Only submitted payments can be reviewed");
    }

    const nextPaymentStatus = payload.approved ? PAYMENT_STATUSES.VERIFIED : PAYMENT_STATUSES.REJECTED;
    await paymentsRepository.update(db, paymentId, { status: nextPaymentStatus });

    const ad = await adsRepository.findById(db, payment.ad_id);
    const nextAdStatus = payload.approved ? AD_STATUSES.PAYMENT_VERIFIED : AD_STATUSES.PAYMENT_PENDING;
    await adsRepository.update(db, ad.id, { status: nextAdStatus });
    await adsRepository.insertStatusHistory(db, {
      adId: ad.id,
      oldStatus: ad.status,
      newStatus: nextAdStatus,
      changedBy: actorUserId,
      note: payload.note,
    });

    await auditRepository.notify(db, {
      userId: ad.user_id,
      title: payload.approved ? "Payment verified" : "Payment rejected",
      message: payload.approved
        ? `${ad.title} is now ready to be scheduled or published.`
        : `${ad.title} payment proof was rejected. ${payload.note || "Please submit a new proof."}`,
    });

    return paymentsRepository.findById(db, paymentId);
  },

  async publishAd(actorUserId, adId, payload) {
    const ad = await adsRepository.findById(db, adId);
    if (!ad) {
      throw new ApiError(404, "Ad not found");
    }

    if (ad.status !== AD_STATUSES.PAYMENT_VERIFIED) {
      throw new ApiError(400, "Payment must be verified before scheduling or publishing an ad");
    }

    const publishAt = payload.publishAt ? new Date(payload.publishAt) : new Date();
    const nextStatus = publishAt > new Date() ? AD_STATUSES.SCHEDULED : AD_STATUSES.PUBLISHED;

    await adsRepository.update(db, adId, {
      status: nextStatus,
      publish_at: publishAt,
      admin_boost: payload.adminBoost ?? ad.admin_boost,
    });
    await adsRepository.insertStatusHistory(db, {
      adId,
      oldStatus: ad.status,
      newStatus: nextStatus,
      changedBy: actorUserId,
      note: payload.note || "Admin publish action",
    });

    await auditRepository.create(db, {
      actorUserId,
      entityType: "ad",
      entityId: adId,
      action: nextStatus === AD_STATUSES.SCHEDULED ? "ad_scheduled" : "ad_published",
      metadata: { publishAt, adminBoost: payload.adminBoost ?? ad.admin_boost },
    });

    return adsRepository.findById(db, adId);
  },

  async getAnalytics() {
    return analyticsRepository.getSnapshot(db);
  },
};
