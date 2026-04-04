const cron = require('node-cron');
const adService = require('../services/adService');

function registerCrons() {
  cron.schedule('0 * * * *', () => adService.runPublishCron().catch(console.error));
  cron.schedule('0 0 * * *', () => adService.runExpireCron().catch(console.error));
}

module.exports = { registerCrons };
