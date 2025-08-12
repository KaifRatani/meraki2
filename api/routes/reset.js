const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_le2bdPxuCv1a@ep-super-hill-ae09e9e0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    firstName,
    lastName,
    state,
    email,
    phone,
    town,
    hearAboutUs,
    mentalHealthRating,
    difficulties,
    comments,
    permissionToContact
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reset_program (
        "firstName",
        "lastName",
        "state",
        "email",
        "phone",
        "town",
        "hearAboutUs",
        "mentalHealthRating",
        "difficulties",
        "comments",
        "permissionToContact"
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING id`,
      [
        firstName,
        lastName,
        state,
        email,
        phone,
        town,
        hearAboutUs,
        mentalHealthRating,
        difficulties,
        comments,
        permissionToContact
      ]
    );

    const insertedId = result.rows[0].id;
    res.status(200).json({ message: 'Form submitted successfully!', id: insertedId });
  } catch (error) {
    console.error('Error inserting data:', error);
    if (error.code === '23505') {
      res.status(400).json({ message: 'A record with this email or unique field already exists.' });
    } else {
      res.status(500).json({ message: 'Error saving form data.' });
    }
  }
};
