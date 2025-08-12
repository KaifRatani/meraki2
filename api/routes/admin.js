// api/routes/admin.js
const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');

const router = express.Router();

// Use Neon DB string (as requested)
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_le2bdPxuCv1a@ep-super-hill-ae09e9e0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
});

// If you already set up session in server.js, you can remove this block.
router.use(session({
  secret: process.env.SESSION_SECRET || 'admin_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // set true when behind HTTPS + trust proxy
}));

// POST /api/admin/login
router.post('/login', async (req, res) => {
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
        WHERE lower(email) = $1 AND lower(usertype) = 'admin'
        LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Admin not found.' });
    }

    const admin = rows[0];

    // PLAINTEXT comparison per your requirement (no hashing for admin)
    if (password !== admin.password) {
      return res.status(403).json({ success: false, message: 'Invalid password.' });
    }

    req.session.admin = {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      usertype: 'admin',
    };

    return res.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
