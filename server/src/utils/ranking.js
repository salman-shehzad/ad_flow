function rankScore(ad) {
  const freshness = Math.max(0, 20 - Math.floor((Date.now() - new Date(ad.publish_at).getTime()) / (1000 * 60 * 60 * 24)));
  return (ad.is_featured ? 50 : 0) + ad.weight * 10 + freshness + (ad.admin_boost || 0);
}

module.exports = { rankScore };
