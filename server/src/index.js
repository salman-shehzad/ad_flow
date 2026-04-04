const app = require('./app');
const env = require('./config/env');
const { registerCrons } = require('./jobs/cron');

app.listen(env.port, () => {
  console.log(`Server listening on ${env.port}`);
  registerCrons();
});
