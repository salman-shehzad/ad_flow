const YT_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/i;

function parseYouTube(url) {
  const match = url.match(YT_REGEX);
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

function isImageUrl(url) {
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url);
}

function normalizeMedia(url) {
  const ytThumb = parseYouTube(url);
  if (ytThumb) {
    return { sourceType: 'youtube', thumbnailUrl: ytThumb, validationStatus: 'valid' };
  }
  if (isImageUrl(url)) {
    return { sourceType: 'image', thumbnailUrl: url, validationStatus: 'valid' };
  }
  return { sourceType: 'image', thumbnailUrl: 'https://placehold.co/600x400?text=AdFlow+Media', validationStatus: 'fallback' };
}

module.exports = { normalizeMedia };
