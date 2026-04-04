const { v4: uuid } = require('uuid');
const db = require('../data');

function submitPayment(adId, amount, proofUrl) {
  const payment = {
    id: uuid(),
    adId,
    amount,
    proofUrl,
    status: 'submitted',
    submittedAt: Date.now(),
    verifiedAt: null,
    verifiedBy: null
  };
  db.payments.push(payment);
  return payment;
}

function verifyPayment(paymentId, adminId) {
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error('Payment not found');
  payment.status = 'verified';
  payment.verifiedAt = Date.now();
  payment.verifiedBy = adminId;
  return payment;
}

function listPendingPayments() {
  return db.payments.filter((p) => p.status === 'submitted');
}

module.exports = { submitPayment, verifyPayment, listPendingPayments };
