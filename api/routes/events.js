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

// GET /api/events — list events
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        description,
        location,
        TO_CHAR(date AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS date,
        TO_CHAR(start_time, 'HH24:MI') AS start_time,
        TRIM(
          CASE WHEN EXTRACT(HOUR FROM duration) > 0
               THEN EXTRACT(HOUR FROM duration) || ' hr ' ELSE '' END ||
          CASE WHEN EXTRACT(MINUTE FROM duration) > 0
               THEN EXTRACT(MINUTE FROM duration) || ' min' ELSE '' END
        ) AS duration
      FROM events
      ORDER BY date ASC, start_time ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send('Failed to fetch events');
  }
});

// POST /api/events/create
router.post('/create', async (req, res) => {
  const { title, description, location, date, start_time, duration } = req.body || {};
  try {
    await pool.query(
      `INSERT INTO events (title, description, location, date, start_time, duration)
       VALUES ($1::text, $2::text, $3::text, $4::timestamptz, $5::time, $6::interval)`,
      [title, description, location, date, start_time, duration]
    );
    res.send('✅ Event created successfully');
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).send('❌ Failed to create event');
  }
});

// PUT /api/events/edit/:id
router.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, location, date, start_time, duration } = req.body || {};
  try {
    await pool.query(
      `UPDATE events
         SET title=$1::text,
             description=$2::text,
             location=$3::text,
             date=$4::timestamptz,
             start_time=$5::time,
             duration=$6::interval
       WHERE id=$7::bigint`,
      [title, description, location, date, start_time, duration, id]
    );
    res.send('✏️ Event updated successfully');
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).send('❌ Failed to update event');
  }
});
// POST /api/events/respond
router.post('/respond', async (req, res) => {
  const {
    event_id, first_name, last_name, email, phone,
    state, town, heard_from, age_group, people_count,
    is_veteran, role
  } = req.body || {};

  try {
    await pool.query(
      `INSERT INTO event_response (
         event_id, first_name, last_name, email, phone,
         state, town, heard_from, age_group, people_count,
         is_veteran, role
       )
       VALUES (
         $1::bigint, $2::text, $3::text, $4::text, $5::text,
         $6::text, $7::text, $8::text, $9::text,
         COALESCE($10::int, 1),          -- 👈 default to 1 if null/undefined
         $11::boolean, $12::text
       )`,
      [
        event_id, first_name, last_name, email, phone,
        state, town, heard_from, age_group, people_count,
        is_veteran, role
      ]
    );
    res.send('✅ Registration recorded successfully!');
  } catch (err) {
    console.error('❌ Error recording registration:', {
      msg: err.message, code: err.code, detail: err.detail, table: err.table
    });
    res.status(500).send('❌ Failed to save response');
  }
});

// GET /api/events/participants
router.get('/participants', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM event_response
      ORDER BY response_time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching participants:', err);
    res.status(500).send('Failed to fetch participants');
  }
});

// DELETE /api/events/delete/:id
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM events WHERE id = $1::bigint`, [id]);
    if (result.rowCount === 0) return res.status(404).send('❌ Event not found.');
    res.send('✅ Event deleted successfully.');
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).send('❌ Failed to delete event.');
  }
});

module.exports = router;
