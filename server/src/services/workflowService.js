import { AD_STATUSES, STATUS_TRANSITIONS } from "../../../shared/index.js";
import { ApiError } from "../utils/apiError.js";

export const assertTransition = (currentStatus, nextStatus) => {
  const allowed = STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(400, `Cannot transition ad from ${currentStatus} to ${nextStatus}`);
  }
};

export const buildStatusSequence = (currentStatus, targetStatus) => {
  if (currentStatus === targetStatus) {
    return [];
  }

  if (currentStatus === AD_STATUSES.SUBMITTED && targetStatus === AD_STATUSES.PAYMENT_PENDING) {
    return [AD_STATUSES.UNDER_REVIEW, AD_STATUSES.PAYMENT_PENDING];
  }

  if (currentStatus === AD_STATUSES.SUBMITTED && targetStatus === AD_STATUSES.REJECTED) {
    return [AD_STATUSES.UNDER_REVIEW, AD_STATUSES.REJECTED];
  }

  if (currentStatus === AD_STATUSES.REJECTED && targetStatus === AD_STATUSES.SUBMITTED) {
    return [AD_STATUSES.DRAFT, AD_STATUSES.SUBMITTED];
  }

  assertTransition(currentStatus, targetStatus);
  return [targetStatus];
};
