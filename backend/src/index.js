require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { testConnection } = require('./db');
const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const usersRoutes = require('./routes/users');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 4000;

// Build the CORS origin allowlist from a comma-separated env variable.
// Falls back to localhost only in development so '*' is never used implicitly.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000'];

// Security & logging middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check (no rate limit needed)
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// API routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/listings', apiLimiter, listingsRoutes);
app.use('/api/users', apiLimiter, usersRoutes);

// 404 handler
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((_err, _req, res, _next) => {
  console.error(_err);
  res.status(_err.status || 500).json({ error: _err.message || 'Internal server error' });
});

(async () => {
  await testConnection();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();

module.exports = app;
