const { z } = require('zod');
const authService = require('../services/authService');

const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const out = await authService.register(data);
    res.json(out);
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const out = await authService.login(data);
    res.json(out);
  } catch (e) { next(e); }
}

module.exports = { register, login };
