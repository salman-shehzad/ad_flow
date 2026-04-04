const app = require('./app');
const { registerCronJobs } = require('./cron');

const port = process.env.PORT || 3000;
registerCronJobs();
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AdFlow API listening on ${port}`);
});
