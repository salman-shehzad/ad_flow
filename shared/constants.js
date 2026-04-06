import { AD_STATUSES, ROLES } from "./workflow.js";

export const JWT_EXPIRES_IN = "7d";
export const PAGINATION_LIMIT = 12;

export const DASHBOARD_ROUTE_BY_ROLE = {
  [ROLES.CLIENT]: "/dashboard/client",
  [ROLES.MODERATOR]: "/dashboard/moderator",
  [ROLES.ADMIN]: "/dashboard/admin",
  [ROLES.SUPER_ADMIN]: "/dashboard/admin",
};

export const BADGE_TONE_BY_STATUS = {
  [AD_STATUSES.DRAFT]: "bg-slate-100 text-slate-700",
  [AD_STATUSES.SUBMITTED]: "bg-sky-100 text-sky-700",
  [AD_STATUSES.UNDER_REVIEW]: "bg-amber-100 text-amber-700",
  [AD_STATUSES.PAYMENT_PENDING]: "bg-orange-100 text-orange-700",
  [AD_STATUSES.PAYMENT_SUBMITTED]: "bg-violet-100 text-violet-700",
  [AD_STATUSES.PAYMENT_VERIFIED]: "bg-indigo-100 text-indigo-700",
  [AD_STATUSES.SCHEDULED]: "bg-cyan-100 text-cyan-700",
  [AD_STATUSES.PUBLISHED]: "bg-emerald-100 text-emerald-700",
  [AD_STATUSES.EXPIRED]: "bg-rose-100 text-rose-700",
  Rejected: "bg-red-100 text-red-700",
};
