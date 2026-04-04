const { z } = require('zod');
const adService = require('../services/adService');

const adSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  categoryId: z.number().int(),
  cityId: z.number().int(),
  packageId: z.number().int(),
  mediaUrl: z.string().url().optional(),
  publishAt: z.string().datetime().optional(),
  expireAt: z.string().datetime().optional(),
  submit: z.boolean().optional(),
});

const paySchema = z.object({ adId: z.number().int(), amount: z.number(), transactionRef: z.string().min(3), screenshotUrl: z.string().url() });

async function createAd(req, res, next) { try { res.json(await adService.createAd(req.user.id, adSchema.parse(req.body))); } catch (e) { next(e); } }
async function updateAd(req, res, next) { try { res.json(await adService.updateAd(req.user.id, Number(req.params.id), req.body)); } catch (e) { next(e); } }
async function submitPayment(req, res, next) { try { res.json(await adService.submitPayment(req.user.id, paySchema.parse(req.body))); } catch (e) { next(e); } }
async function dashboard(req, res, next) { try { res.json(await adService.clientDashboard(req.user.id)); } catch (e) { next(e); } }

module.exports = { createAd, updateAd, submitPayment, dashboard };
