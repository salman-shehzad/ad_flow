const STATES = Object.freeze({
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  PAYMENT_PENDING: 'Payment Pending',
  PAYMENT_SUBMITTED: 'Payment Submitted',
  PAYMENT_VERIFIED: 'Payment Verified',
  SCHEDULED: 'Scheduled',
  PUBLISHED: 'Published',
  EXPIRED: 'Expired',
  ARCHIVED: 'Archived',
  REJECTED: 'Rejected'
});

const transitions = {
  [STATES.DRAFT]: [STATES.SUBMITTED],
  [STATES.SUBMITTED]: [STATES.UNDER_REVIEW],
  [STATES.UNDER_REVIEW]: [STATES.PAYMENT_PENDING, STATES.REJECTED],
  [STATES.PAYMENT_PENDING]: [STATES.PAYMENT_SUBMITTED],
  [STATES.PAYMENT_SUBMITTED]: [STATES.PAYMENT_VERIFIED],
  [STATES.PAYMENT_VERIFIED]: [STATES.SCHEDULED, STATES.PUBLISHED],
  [STATES.SCHEDULED]: [STATES.PUBLISHED],
  [STATES.PUBLISHED]: [STATES.EXPIRED],
  [STATES.EXPIRED]: [STATES.ARCHIVED],
  [STATES.REJECTED]: [STATES.ARCHIVED],
  [STATES.ARCHIVED]: []
};

function canTransition(from, to) {
  return (transitions[from] || []).includes(to);
}

function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid workflow transition from '${from}' to '${to}'`);
  }
}

module.exports = { STATES, transitions, canTransition, assertTransition };
