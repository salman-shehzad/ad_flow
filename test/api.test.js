const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/data');
const { STATES } = require('../src/workflow');

test('public ads endpoint returns published items', async () => {
  const response = await request(app).get('/api/ads').expect(200);
  assert.ok(Array.isArray(response.body.items));
  assert.ok(response.body.items.every((item) => item.state === STATES.PUBLISHED));
});

test('full workflow can be executed via API', async () => {
  const create = await request(app)
    .post('/api/client/ads')
    .send({
      title: 'API Flow Car',
      city: 'Austin',
      category: 'Vehicles',
      packageId: 'basic',
      price: 12000,
      mediaUrls: ['https://example.com/car.jpg']
    })
    .expect(201);

  const adId = create.body.id;

  await request(app).patch(`/api/client/ads/${adId}/submit`).send({}).expect(200);
  await request(app)
    .patch(`/api/moderator/ads/${adId}/decision`)
    .send({ approved: true, notes: 'Looks good' })
    .expect(200);
  await request(app)
    .post(`/api/client/ads/${adId}/payments`)
    .send({ amount: 99, proofUrl: 'https://example.com/proof.png' })
    .expect(201);

  const payment = db.payments[db.payments.length - 1];

  await request(app).patch(`/api/admin/payments/${payment.id}/verify`).send({}).expect(200);
  const publish = await request(app).patch(`/api/admin/ads/${adId}/publish`).send({}).expect(200);

  assert.equal(publish.body.state, STATES.PUBLISHED);
  assert.ok(publish.body.expiresAt > Date.now());
});
