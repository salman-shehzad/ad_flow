import { AD_STATUSES } from "../../../shared/index.js";
import { db } from "../config/db.js";
import { adsRepository } from "../repositories/adsRepository.js";

export const cronService = {
  async publishScheduledAds() {
    const ads = await adsRepository.listScheduledForPublish(db);
    for (const ad of ads) {
      await adsRepository.update(db, ad.id, { status: AD_STATUSES.PUBLISHED });
      await adsRepository.insertStatusHistory(db, {
        adId: ad.id,
        oldStatus: ad.status,
        newStatus: AD_STATUSES.PUBLISHED,
        changedBy: null,
        note: "Published by scheduler",
      });
    }
    return ads.length;
  },

  async expireAds() {
    const ads = await adsRepository.listForExpiry(db);
    for (const ad of ads) {
      await adsRepository.update(db, ad.id, { status: AD_STATUSES.EXPIRED });
      await adsRepository.insertStatusHistory(db, {
        adId: ad.id,
        oldStatus: ad.status,
        newStatus: AD_STATUSES.EXPIRED,
        changedBy: null,
        note: "Expired by scheduler",
      });
    }
    return ads.length;
  },
};
