const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'change_me_in_env';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
    || 'postgresql://neondb_owner:npg_le2bdPxuCv1a@ep-super-hill-ae09e9e0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }

    const emailLower = String(email).toLowerCase();
    const { rows } = await pool.query(
      `SELECT id, email, username, password, usertype
       FROM public.login
       WHERE lower(email) = lower($1)`,
      [emailLower]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, usertype: user.usertype },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      usertype: user.usertype
    });
  } catch (err) {
    console.error('Login error:', { code: err.code, detail: err.detail, message: err.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
