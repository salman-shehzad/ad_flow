import { DEFAULT_PLACEHOLDER_IMAGE, MEDIA_TYPES, VALIDATION_STATUSES } from "../../../shared/index.js";

const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const imageRegex = /\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i;

export const extractYouTubeId = (url) => url.match(youtubeRegex)?.[1] || null;

export const normalizeMedia = (urls = []) =>
  urls.map((originalUrl) => {
    const youtubeId = extractYouTubeId(originalUrl);

    if (youtubeId) {
      return {
        sourceType: MEDIA_TYPES.YOUTUBE,
        originalUrl,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        validationStatus: VALIDATION_STATUSES.VALID,
      };
    }

    let isValid = false;
    try {
      const parsed = new URL(originalUrl);
      isValid = ["http:", "https:"].includes(parsed.protocol) && imageRegex.test(parsed.pathname + parsed.search);
    } catch {
      isValid = false;
    }

    return {
      sourceType: MEDIA_TYPES.IMAGE,
      originalUrl,
      thumbnailUrl: isValid ? originalUrl : DEFAULT_PLACEHOLDER_IMAGE,
      validationStatus: isValid ? VALIDATION_STATUSES.VALID : VALIDATION_STATUSES.INVALID,
    };
  });
