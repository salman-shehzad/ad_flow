const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const moderatorRoutes = require('./routes/moderatorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/moderator', moderatorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

app.use(errorHandler);

module.exports = app;
