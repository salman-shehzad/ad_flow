import { DEFAULT_PLACEHOLDER_IMAGE, FALLBACK_AD_IMAGES } from "@shared/index";

const pickFallbackImage = (adId) => {
  const numericId = Number(adId);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    return FALLBACK_AD_IMAGES[0] || DEFAULT_PLACEHOLDER_IMAGE;
  }

  return FALLBACK_AD_IMAGES[(numericId - 1) % FALLBACK_AD_IMAGES.length] || DEFAULT_PLACEHOLDER_IMAGE;
};

export const getAdImage = (ad) => ad?.media?.[0]?.thumbnail_url || pickFallbackImage(ad?.id);
