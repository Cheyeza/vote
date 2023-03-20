const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'srcvote',
  password: 'admin12345',
  port: 5432,
})

module.exports = pool