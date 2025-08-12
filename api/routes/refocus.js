const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://merakiAdmin:root1Admin@operationmeraki-server1.postgres.database.azure.com:5432/operationmeraki-database?sslmode=require',
  ssl: { rejectUnauthorized: false }
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
      `INSERT INTO refocus_program (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
