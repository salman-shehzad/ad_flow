const test = require('node:test');
const assert = require('node:assert/strict');
const db = require('../src/data');
const { createDraft } = require('../src/services/adService');

test('createDraft rejects unknown packages and does not persist an ad', () => {
  const initialCount = db.ads.length;

  assert.throws(
    () =>
      createDraft(
        {
          title: 'Invalid Package Listing',
          city: 'Chicago',
          category: 'Services',
          packageId: 'does-not-exist',
          price: 100,
          mediaUrls: []
        },
        'u-client'
      ),
    /Invalid package/
  );

  assert.equal(db.ads.length, initialCount);
});
