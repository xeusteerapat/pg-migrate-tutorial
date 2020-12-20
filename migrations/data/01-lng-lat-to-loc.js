const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'socialnetwork',
  user: process.env.DB_USERNAME,
  password: '',
});

pool
  .query(
    `
  UPDATE posts
  SET loc = POINT(lng, lat)
  WHERE loc IS NULL;
`
  )
  .then(() => {
    console.log('updated complete');
    pool.end();
  })
  .catch(err => console.log(err.message));
