const ROLES = {
  CLIENT: 'client',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

const AD_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  PAYMENT_PENDING: 'Payment Pending',
  PAYMENT_SUBMITTED: 'Payment Submitted',
  PAYMENT_VERIFIED: 'Payment Verified',
  SCHEDULED: 'Scheduled',
  PUBLISHED: 'Published',
  EXPIRED: 'Expired',
};

const PAYMENT_STATUS = {
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

module.exports = { ROLES, AD_STATUS, PAYMENT_STATUS };
