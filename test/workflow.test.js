const test = require('node:test');
const assert = require('node:assert/strict');
const { canTransition, STATES } = require('../src/workflow');

test('valid transitions are allowed', () => {
  assert.equal(canTransition(STATES.DRAFT, STATES.SUBMITTED), true);
  assert.equal(canTransition(STATES.PAYMENT_VERIFIED, STATES.PUBLISHED), true);
});

test('invalid transitions are rejected', () => {
  assert.equal(canTransition(STATES.DRAFT, STATES.PUBLISHED), false);
  assert.equal(canTransition(STATES.REJECTED, STATES.PUBLISHED), false);
});
