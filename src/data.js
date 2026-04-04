const { v4: uuid } = require('uuid');
const { STATES } = require('./workflow');

const now = Date.now();

const packages = [
  { id: 'basic', name: 'Basic', durationDays: 7, weight: 10 },
  { id: 'standard', name: 'Standard', durationDays: 15, weight: 25 },
  { id: 'premium', name: 'Premium', durationDays: 30, weight: 50 }
];

const users = [
  { id: 'u-client', role: 'client', name: 'Client User' },
  { id: 'u-mod', role: 'moderator', name: 'Moderator User' },
  { id: 'u-admin', role: 'admin', name: 'Admin User' },
  { id: 'u-super', role: 'super_admin', name: 'Super Admin User' }
];

const ads = [
  {
    id: uuid(),
    title: 'Seed Premium Apartment',
    city: 'New York',
    category: 'Real Estate',
    packageId: 'premium',
    ownerId: 'u-client',
    price: 2500,
    mediaUrls: ['https://example.com/media/apt.jpg'],
    state: STATES.PUBLISHED,
    featured: true,
    adminBoost: 20,
    createdAt: now - 1000 * 60 * 60 * 2,
    updatedAt: now - 1000 * 60 * 60,
    scheduledAt: null,
    publishedAt: now - 1000 * 60 * 60,
    expiresAt: now + 1000 * 60 * 60 * 24 * 10,
    moderationNotes: null
  }
];

const payments = [];
const notifications = [];
const auditLogs = [];

module.exports = { packages, users, ads, payments, notifications, auditLogs };
