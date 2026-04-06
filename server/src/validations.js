import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const adCreateSchema = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  description: Joi.string().min(20).required(),
  categoryId: Joi.number().integer().required(),
  cityId: Joi.number().integer().required(),
  packageId: Joi.number().integer().required(),
  publishAt: Joi.date().optional(),
  mediaUrls: Joi.array().items(Joi.string().uri()).default([]),
});

export const adUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(150),
  description: Joi.string().min(20),
  categoryId: Joi.number().integer(),
  cityId: Joi.number().integer(),
  packageId: Joi.number().integer(),
  publishAt: Joi.date(),
  mediaUrls: Joi.array().items(Joi.string().uri()),
  submit: Joi.boolean(),
}).min(1);

export const paymentSchema = Joi.object({
  adId: Joi.number().integer().required(),
  amount: Joi.number().positive(),
  transactionRef: Joi.string().min(4).required(),
  screenshotUrl: Joi.string().uri().required(),
});

export const moderationReviewSchema = Joi.object({
  approved: Joi.boolean().required(),
  note: Joi.string().allow("", null),
});

export const paymentReviewSchema = Joi.object({
  approved: Joi.boolean().required(),
  note: Joi.string().allow("", null),
});

export const adminPublishSchema = Joi.object({
  publishAt: Joi.date().optional(),
  adminBoost: Joi.number().integer().min(0).max(100).optional(),
  note: Joi.string().allow("", null),
});

export const publicAdsQuerySchema = Joi.object({
  search: Joi.string().allow(""),
  categoryId: Joi.number().integer(),
  cityId: Joi.number().integer(),
  limit: Joi.number().integer().min(1).max(50),
});
