const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { Pool } = require('pg');            // ⬅ add
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Session setup (only needs to be done once)
app.use(session({
  secret: 'operationMerakiSecret', // use a secure secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set true if using HTTPS
}));

// --- Subscribe (Neon) -----------------------------
const subscribePool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_le2bdPxuCv1a@ep-super-hill-ae09e9e0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
});

// POST /subscribe — just insert email
app.post('/subscribe', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    const result = await subscribePool.query(
      `INSERT INTO "emailSub" (email) VALUES ($1) RETURNING id`,
      [email]
    );
    return res.status(200).json({ message: '✅ Subscribed!', id: result.rows[0].id });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: '⚠️ Email already subscribed.' });
    }
    console.error('Subscribe error:', err);
    return res.status(500).json({ message: '❌ Server error. Could not save.' });
  }
});
// ---------------------------------------------------

// Mount API routes FIRST
app.use('/api/events', require('./routes/events'));

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, '../ui')));
app.use('/images', express.static(path.join(__dirname, '../images')));

// Route: Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../ui/index.html'));
});

// Helper to safely mount routes
function mountRoute(pathPrefix, routePath) {
  try {
    const route = require(routePath);
    if (typeof route === 'function') {
      app.use(pathPrefix, route);
      console.log(`✅ Mounted route: ${pathPrefix}`);
    } else {
      console.warn(`⚠️ Route at ${routePath} does not export a router.`);
    }
  } catch (err) {
    console.error(`❌ Failed to mount ${pathPrefix}:`, err.message);
  }
}

// Mount API routes
mountRoute('/api/veteran', './routes/veteran');
mountRoute('/api/volunteer', './routes/volunteer');
mountRoute('/api/login', './routes/login');    
mountRoute('/api/signin', './routes/signin');
mountRoute('/api/admin/login', './routes/adminLogin');
mountRoute('/api/events', './routes/events');
mountRoute('/api/admin', './routes/admin');
mountRoute('/api/reset', './routes/reset');
mountRoute('/api/refocus', './routes/refocus');
mountRoute('/api/reengage', './routes/reengage');
mountRoute('/api/events', './routes/events');

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
