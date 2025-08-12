const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_le2bdPxuCv1a@ep-super-hill-ae09e9e0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
});

// If you already configure session in server.js, remove this block.
router.use(session({
  secret: process.env.SESSION_SECRET || 'admin_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

router.post('/', async (req, res) => {
  try {
    let { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required.' });
    }

    email = String(email).trim().toLowerCase();
    password = String(password);

    const { rows } = await pool.query(
      `SELECT id, email, username, password, usertype
         FROM public.login
        WHERE lower(email) = $1
        LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const admin = rows[0];

    if (String(admin.usertype || '').toLowerCase() !== 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // PLAINTEXT comparison (as requested)
    if (password !== admin.password) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    req.session.admin = { id: admin.id, email: admin.email, username: admin.username, usertype: 'admin' };
    return res.json({ success: true, message: 'Admin login successful.' });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
