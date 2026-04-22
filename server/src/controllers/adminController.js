import { adminService } from "../services/adminService.js";

export const adminController = {
  async paymentQueue(_req, res) {
    const data = await adminService.getPaymentQueue();
    res.json(data);
  },

  async readyAds(_req, res) {
    const data = await adminService.getReadyAds();
    res.json(data);
  },

  async verifyPayment(req, res) {
    const payment = await adminService.verifyPayment(
      req.user.id,
      Number(req.params.id),
      req.body,
    );
    res.json(payment);
  },

  async publishAd(req, res) {
    const ad = await adminService.publishAd(req.user.id, Number(req.params.id), req.body);
    res.json(ad);
  },

  async analytics(_req, res) {
    const data = await adminService.getAnalytics();
    res.json(data);
  },

  async users(_req, res) {
    const data = await adminService.getUsers();
    res.json(data);
  },
};
