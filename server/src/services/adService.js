import { AD_STATUSES, PAYMENT_STATUSES } from "../../../shared/index.js";
import { db } from "../config/db.js";
import { adsRepository } from "../repositories/adsRepository.js";
import { auditRepository } from "../repositories/auditRepository.js";
import { metaRepository } from "../repositories/metaRepository.js";
import { paymentsRepository } from "../repositories/paymentsRepository.js";
import { getSupabase } from "../lib/supabaseClient.js";
import { normalizeMedia } from "./mediaService.js";
import { buildStatusSequence } from "./workflowService.js";
import { ApiError } from "../utils/apiError.js";

export const createAd = async (payload) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("ads").insert(payload).select().single();

  if (error) {
    console.error("Failed to create ad in Supabase", error);
    throw error;
  }

  return data;
};

export const getAds = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch ads from Supabase", error);
    throw error;
  }

  return data;
};

export const updateAd = async (id, updates) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("ads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update ad in Supabase", error);
    throw error;
  }

  return data;
};

export const deleteAd = async (id) => {
  const supabase = getSupabase();
  const { error } = await supabase.from("ads").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete ad in Supabase", error);
    throw error;
  }

  return { success: true };
};

const applyStatusSequence = async (client, ad, statuses, actorUserId, note) => {
  let currentStatus = ad.status;

  for (const status of statuses) {
    await adsRepository.update(client, ad.id, { status });
    await adsRepository.insertStatusHistory(client, {
      adId: ad.id,
      oldStatus: currentStatus,
      newStatus: status,
      changedBy: actorUserId,
      note,
    });
    currentStatus = status;
  }

  return adsRepository.findById(client, ad.id);
};

export const adService = {
  async createAd(userId, payload) {
    const pkg = await metaRepository.findPackageById(db, payload.packageId);
    if (!pkg) {
      throw new ApiError(404, "Selected package was not found");
    }

    const publishAt = payload.publishAt ? new Date(payload.publishAt) : new Date();
    const expireAt = new Date(
      publishAt.getTime() + pkg.duration_days * 24 * 60 * 60 * 1000,
    );
    const ad = await adsRepository.create(db, {
      userId,
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityId: payload.cityId,
      packageId: payload.packageId,
      status: AD_STATUSES.DRAFT,
      publishAt,
      expireAt,
    });

    await adsRepository.replaceMedia(db, ad.id, normalizeMedia(payload.mediaUrls || []));
    await adsRepository.insertStatusHistory(db, {
      adId: ad.id,
      oldStatus: null,
      newStatus: AD_STATUSES.DRAFT,
      changedBy: userId,
      note: "Ad created",
    });
    await auditRepository.create(db, {
      actorUserId: userId,
      entityType: "ad",
      entityId: ad.id,
      action: "ad_created",
      metadata: { title: ad.title },
    });

    return adsRepository.findById(db, ad.id);
  },

  async updateAd(userId, adId, payload) {
    const ad = await adsRepository.findOwnedByUser(db, adId, userId);
    if (!ad) {
      throw new ApiError(404, "Ad not found");
    }

    if ([AD_STATUSES.PUBLISHED, AD_STATUSES.EXPIRED].includes(ad.status)) {
      throw new ApiError(400, "Published or expired ads can no longer be edited");
    }

    const updates = {};
    if (payload.title) updates.title = payload.title;
    if (payload.description) updates.description = payload.description;
    if (payload.categoryId) updates.category_id = payload.categoryId;
    if (payload.cityId) updates.city_id = payload.cityId;
    if (payload.publishAt) updates.publish_at = payload.publishAt;

    const effectivePackageId = payload.packageId || ad.package_id;
    if (payload.packageId) {
      const pkg = await metaRepository.findPackageById(db, payload.packageId);
      if (!pkg) {
        throw new ApiError(404, "Selected package was not found");
      }
      updates.package_id = payload.packageId;
    }

    if (payload.publishAt || payload.packageId) {
      const pkg = await metaRepository.findPackageById(db, effectivePackageId);
      const publishAt = payload.publishAt
        ? new Date(payload.publishAt)
        : new Date(ad.publish_at || Date.now());
      updates.expire_at = new Date(
        publishAt.getTime() + pkg.duration_days * 24 * 60 * 60 * 1000,
      );
    }

    if (Object.keys(updates).length > 0) {
      await adsRepository.update(db, adId, updates);
      await auditRepository.create(db, {
        actorUserId: userId,
        entityType: "ad",
        entityId: adId,
        action: "ad_updated",
        metadata: Object.keys(updates),
      });
    }

    if (payload.mediaUrls) {
      await adsRepository.replaceMedia(db, adId, normalizeMedia(payload.mediaUrls));
    }

    let refreshedAd = await adsRepository.findById(db, adId);

    if (payload.submit === true) {
      const sequence = buildStatusSequence(refreshedAd.status, AD_STATUSES.SUBMITTED);
      refreshedAd = await applyStatusSequence(
        db,
        refreshedAd,
        sequence,
        userId,
        "Submitted for review",
      );
      await auditRepository.notify(db, {
        userId,
        title: "Ad submitted",
        message: `${refreshedAd.title} has been submitted for moderation.`,
      });
      await auditRepository.create(db, {
        actorUserId: userId,
        entityType: "ad",
        entityId: adId,
        action: "ad_submitted",
        metadata: { fromStatus: ad.status },
      });
    }

    return adsRepository.findById(db, adId);
  },

  async getClientDashboard(userId) {
    const ads = await adsRepository.listForOwner(db, userId);
    return {
      summary: {
        totalAds: ads.length,
        publishedAds: ads.filter((ad) => ad.status === AD_STATUSES.PUBLISHED).length,
        pendingReview: ads.filter((ad) =>
          [AD_STATUSES.SUBMITTED, AD_STATUSES.UNDER_REVIEW].includes(ad.status),
        ).length,
        scheduledAds: ads.filter((ad) => ad.status === AD_STATUSES.SCHEDULED).length,
      },
      ads,
    };
  },

  async submitPayment(userId, payload) {
    const ad = await adsRepository.findOwnedByUser(db, payload.adId, userId);
    if (!ad) {
      throw new ApiError(404, "Ad not found");
    }

    if (ad.status !== AD_STATUSES.PAYMENT_PENDING) {
      throw new ApiError(400, "This ad is not ready for payment submission");
    }

    const existingPayment = await paymentsRepository.findLatestByAdId(db, payload.adId);
    if (existingPayment?.status === PAYMENT_STATUSES.SUBMITTED) {
      throw new ApiError(400, "A payment proof is already awaiting verification");
    }

    const payment = await paymentsRepository.create(db, {
      adId: payload.adId,
      amount: payload.amount || ad.package_price,
      transactionRef: payload.transactionRef,
      screenshotUrl: payload.screenshotUrl,
      status: PAYMENT_STATUSES.SUBMITTED,
    });

    await applyStatusSequence(
      db,
      ad,
      [AD_STATUSES.PAYMENT_SUBMITTED],
      userId,
      "Payment submitted",
    );
    await auditRepository.notify(db, {
      userId,
      title: "Payment submitted",
      message: `Payment proof for ${ad.title} is awaiting verification.`,
    });
    await auditRepository.create(db, {
      actorUserId: userId,
      entityType: "payment",
      entityId: payment.id,
      action: "payment_submitted",
      metadata: { adId: ad.id, amount: payment.amount },
    });

    return payment;
  },
};
