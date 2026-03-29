/* ============================================================
   server.js  —  Express Application Entry Point
   Fitness Goal Tracker API

   Startup order:
     1. Load environment variables (dotenv)  ← must be first
     2. Connect to MongoDB
     3. Create Express app
     4. Register middleware (cors, json parsing)
     5. Mount routes
     6. Mount error handler
     7. Start listening
   ============================================================ */

// ── 1. Load environment variables ────────────────────────────
// dotenv.config() must run before any other require that reads
// process.env (e.g. config/db uses MONGODB_URI on call).
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ── Routes ──────────────────────────────────────────────────
const healthRoutes      = require('./routes/health');
const authRoutes        = require('./routes/auth');
const userRoutes        = require('./routes/users');
const workoutRoutes     = require('./routes/workouts');
const metricsRoutes     = require('./routes/metrics');
const progressRoutes    = require('./routes/progress');
const suggestionsRoutes = require('./routes/suggestions');

// ── 2. Connect to MongoDB ────────────────────────────────────
connectDB();

// ── 3. Create Express app ────────────────────────────────────
const app = express();

// Remove the default X-Powered-By header (minor security hardening)
app.disable('x-powered-by');

// ── 4. Middleware ─────────────────────────────────────────────

// CORS — build the allowed-origins list from CLIENT_URL so a
// single environment variable covers production deployments.
// CLIENT_URL may be a comma-separated list for multiple frontends:
//   e.g.  CLIENT_URL=https://my-app.onrender.com,https://my-app.netlify.app
const allowedOrigins = new Set([
  ...(process.env.CLIENT_URL || 'http://localhost:5500')
    .split(',')
    .map(u => u.trim())
    .filter(Boolean),
  'http://127.0.0.1:5500',   // Live Server default (local dev)
  'http://localhost:5500',
]);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Thunder Client, curl, same-origin)
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// ── 5. Mount Routes ──────────────────────────────────────────
app.use('/api',              healthRoutes);
app.use('/api/auth',         authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/workouts',     workoutRoutes);
app.use('/api/metrics',      metricsRoutes);
app.use('/api/progress',     progressRoutes);
app.use('/api/suggestions',  suggestionsRoutes);

// ── 5b. Serve Frontend Static Files ──────────────────────────
// client/ sits one level above server/ in the repo.
// API routes (/api/*) are matched first above; any other request
// (e.g. /, /dashboard.html, /css/styles.css) is served from client/.
app.use(express.static(path.join(__dirname, '..', 'client')));

// ── 6. Global Error Handler (must be last middleware) ─────────
app.use(errorHandler);

// ── 7. Start Server ──────────────────────────────────────────
// Render (and most PaaS hosts) injects PORT automatically.
// Fallback to 5000 for local development.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('─────────────────────────────────────────');
  console.log('  Fitness Goal Tracker API');
  console.log(`  Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log('─────────────────────────────────────────');
});

module.exports = app;
