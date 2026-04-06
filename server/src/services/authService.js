import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, ROLES } from "../../../shared/index.js";
import { db } from "../config/db.js";
import { env } from "../config/env.js";
import { usersRepository } from "../repositories/usersRepository.js";
import { ApiError } from "../utils/apiError.js";

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, env.jwtSecret, {
    expiresIn: JWT_EXPIRES_IN,
  });

export const authService = {
  async register(payload) {
    const existingUser = await usersRepository.findByEmail(db, payload.email);
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await usersRepository.create(db, {
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: payload.role || ROLES.CLIENT,
    });

    return { user, token: signToken(user) };
  },

  async login(payload) {
    const user = await usersRepository.findByEmail(db, payload.email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(payload.password, user.password_hash);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    return { user: safeUser, token: signToken(safeUser) };
  },
};
