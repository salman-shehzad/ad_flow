import { publicService } from "../services/publicService.js";

export const publicController = {
  async listAds(req, res) {
    const ads = await publicService.listAds(req.query);
    res.json(ads);
  },

  async getAd(req, res) {
    const ad = await publicService.getAdById(Number(req.params.id));
    res.json(ad);
  },

  async packages(_req, res) {
    const items = await publicService.getPackages();
    res.json(items);
  },

  async filters(_req, res) {
    const data = await publicService.getFilters();
    res.json(data);
  },
};
