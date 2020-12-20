const express = require('express');
const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'socialnetwork',
  user: process.env.DB_USERNAME,
  password: '',
});

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/posts', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT * FROM posts;
  `);

  res.send(`
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>Longitude</th>
          <th>Latitude</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(row => {
            return `
            <tr>
              <td>${row.id}</td>
              <td>${row.lat}</td>
              <td>${row.lng}</td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>

    <form method="POST">
        <h3>Create Post</h3>
        <div>
            <lable>Longitude</lable>
            <input name="lng"/>
            <lable>Latitude</lable>
            <input name="lat"/>
        </div> 
        <button type="submit">
        Create
        </button>
    </form>
  `);
});

app.post('/posts', async (req, res) => {
  const { lng, lat } = req.body;

  await pool.query('INSERT INTO posts (lat, lng) VALUES ($1, $2);', [lat, lng]);

  res.redirect('/posts');
});

app.listen(3005, () => {
  console.log('Listening on port 3005');
});
