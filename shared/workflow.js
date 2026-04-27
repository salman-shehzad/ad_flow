export const ROLES = {
  CLIENT: "client",
  MODERATOR: "moderator",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

export const AD_STATUSES = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  PAYMENT_PENDING: "Payment Pending",
  PAYMENT_SUBMITTED: "Payment Submitted",
  PAYMENT_VERIFIED: "Payment Verified",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
};

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

export const MEDIA_TYPES = {
  IMAGE: "image",
  YOUTUBE: "youtube",
};

export const VALIDATION_STATUSES = {
  PENDING: "pending",
  VALID: "valid",
  INVALID: "invalid",
};

export const PUBLIC_AD_STATUSES = [AD_STATUSES.PUBLISHED];

export const STATUS_TRANSITIONS = {
  [AD_STATUSES.DRAFT]: [AD_STATUSES.SUBMITTED],
  [AD_STATUSES.SUBMITTED]: [AD_STATUSES.UNDER_REVIEW],
  [AD_STATUSES.UNDER_REVIEW]: [AD_STATUSES.SCHEDULED, AD_STATUSES.PUBLISHED, AD_STATUSES.REJECTED],
  [AD_STATUSES.PAYMENT_PENDING]: [AD_STATUSES.PAYMENT_SUBMITTED],
  [AD_STATUSES.PAYMENT_SUBMITTED]: [AD_STATUSES.PAYMENT_VERIFIED],
  [AD_STATUSES.PAYMENT_VERIFIED]: [AD_STATUSES.SCHEDULED, AD_STATUSES.PUBLISHED],
  [AD_STATUSES.SCHEDULED]: [AD_STATUSES.PUBLISHED, AD_STATUSES.EXPIRED],
  [AD_STATUSES.PUBLISHED]: [AD_STATUSES.EXPIRED],
  [AD_STATUSES.REJECTED]: [AD_STATUSES.DRAFT],
};

export const DEFAULT_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80";

export const FALLBACK_AD_IMAGES = [
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
];

export const WORKFLOW_LABELS = [
  AD_STATUSES.DRAFT,
  AD_STATUSES.SUBMITTED,
  AD_STATUSES.UNDER_REVIEW,
  AD_STATUSES.SCHEDULED,
  AD_STATUSES.PUBLISHED,
  AD_STATUSES.EXPIRED,
];
