import mysql from 'mysql2/promise.js';

const pool = mysql.createPool({
  host: '64.225.21.133',
  user: 'u1_fPQ831rGsr',
  password: '=2Tr+I.KIJ0BX!F3=qUvTz5R',
  database: 's1_taskmanagement',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
