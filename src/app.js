const express = require('express');
const api = require('./routes/api');

const app = express();
app.use(express.json());
app.use('/api', api);

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || 'Unknown error' });
});

module.exports = app;
