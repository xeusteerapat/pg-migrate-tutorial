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
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  <title>Document</title>
</head>
<body>
  <table class="table table-striped">
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

    <div class="container">
        <h3>Create Post</h3>
        <form method="POST">
        <div class="mb-3">
          <div class="col-sm-10">
            <lable class="form-label">Longitude</lable>
            <input name="lng" class="form-control"/>
          </div>
          <div class="col-sm-10">
            <lable class="form-label">Latitude</lable>
            <input name="lat" class="form-control"/>
          </div>
        </div> 
        <button type="submit" class="btn btn-primary">
          Create
        </button>
    </form>
    </div>
</body>
</html>
  `);
});

app.post('/posts', async (req, res) => {
  const { lng, lat } = req.body;

  await pool.query(
    `
    INSERT INTO posts (lat, lng, loc) VALUES ($1, $2, $3);`,
    [lat, lng, `(${lng}, ${lat})`]
  );

  res.redirect('/posts');
});

app.listen(3005, () => {
  console.log('Listening on port 3005');
});
