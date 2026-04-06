import { adService } from "../services/adService.js";

export const clientController = {
  async createAd(req, res) {
    const ad = await adService.createAd(req.user.id, req.body);
    res.status(201).json(ad);
  },

  async updateAd(req, res) {
    const ad = await adService.updateAd(req.user.id, Number(req.params.id), req.body);
    res.json(ad);
  },

  async submitPayment(req, res) {
    const payment = await adService.submitPayment(req.user.id, req.body);
    res.status(201).json(payment);
  },

  async dashboard(req, res) {
    const data = await adService.getClientDashboard(req.user.id);
    res.json(data);
  },
};
