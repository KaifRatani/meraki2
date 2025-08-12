// api/subscribe-server.js (or merge into your existing server)
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Neon DB string (as requested)
const pool = new Pool({
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
    const raw = String(req.body?.email || '');
    const email = raw.trim().toLowerCase();

    // simple email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    const result = await pool.query(
      `INSERT INTO "emailSub" (email) VALUES ($1) RETURNING id`,
      [email]
    );

    return res.status(200).json({
      message: '✅ Subscribed!',
      id: result.rows[0].id
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: '⚠️ Email already subscribed.' });
    }
    console.error('Subscribe error:', error);
    return res.status(500).json({ message: '❌ Server error. Could not save.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
