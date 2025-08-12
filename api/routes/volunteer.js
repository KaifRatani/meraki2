const express = require('express');
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

// POST /api/volunteer
router.post('/', async (req, res) => {
  try {
    const {
      fullName = '',
      email = '',
      phone = '',
      street = '',
      city = '',
      state = '',
      zip = '',
      availability = '',
      interests = '',
    } = req.body || {};

    const emailNorm = String(email).trim().toLowerCase();
    const state2 = String(state).trim().toUpperCase().slice(0, 2);

    const result = await pool.query(
      `INSERT INTO volunteer
       ("fullName","email","phone","streetAddress","City","state","zipCode","availability","areaOfInterest")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        String(fullName).trim(),
        emailNorm,
        String(phone).trim(),
        String(street).trim(),
        String(city).trim(),
        state2,
        String(zip).trim(),
        String(availability).trim(),
        String(interests).trim(),
      ]
    );

    return res.status(200).json({ message: 'Form submitted successfully!', id: result.rows[0].id });
  } catch (error) {
    console.error('Volunteer insert error:', error);
    // (no unique email on this table in your schema, but keep generic handler)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'A record with this unique field already exists.' });
    }
    return res.status(500).json({ message: 'Error saving form data.' });
  }
});

module.exports = router;
