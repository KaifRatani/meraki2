const pool = require('./db/pool');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected:', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }
})();
