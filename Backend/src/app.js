const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const { env } = require('./config/env');
const maybeClerk = require('./middleware/maybeClerk');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  // Conditional JSON body parsing: allow larger payloads on /ingest
  app.use((req, res, next) => {
    if (req.path.startsWith('/ingest')) {
      return express.json({ limit: '50mb' })(req, res, next);
    }
    return express.json({ limit: '1mb' })(req, res, next);
  });
  app.use(cookieParser());
  // Robust CORS: allow one or more origins via CORS_ORIGIN (comma-separated)
  const allowedOrigins = String(env.CORS_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow non-browser requests or same-origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));

  // Optional Clerk context; becomes a no-op if keys are missing.
  app.use(maybeClerk());

  // Public endpoints
  app.get('/', (req, res) => {
    res.json({ name: 'Lernflow API', health: 'ok' });
  });
  app.get('/health', (req, res) => {
    res.json({ ok: true, env: env.NODE_ENV });
  });

  // API routes
  app.use('/', require('./routes'));

  // 404 + error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
