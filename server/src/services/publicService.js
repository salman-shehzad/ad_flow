import { AD_STATUSES } from "../../../shared/index.js";
import { db } from "../config/db.js";
import { adsRepository } from "../repositories/adsRepository.js";
import { metaRepository } from "../repositories/metaRepository.js";
import { ApiError } from "../utils/apiError.js";

export const publicService = {
  async listAds(filters) {
    return adsRepository.listForPublic(db, filters);
  },

  async getAdById(id) {
    const ad = await adsRepository.findById(db, id);
    const now = new Date();
    if (
      !ad ||
      ad.status !== AD_STATUSES.PUBLISHED ||
      (ad.publish_at && new Date(ad.publish_at) > now) ||
      (ad.expire_at && new Date(ad.expire_at) <= now)
    ) {
      throw new ApiError(404, "Ad not found");
    }
    return ad;
  },

  async getPackages() {
    return metaRepository.listPackages(db);
  },

  async getFilters() {
    const [categories, cities] = await Promise.all([
      metaRepository.listCategories(db),
      metaRepository.listCities(db),
    ]);

    return { categories, cities };
  },
};
