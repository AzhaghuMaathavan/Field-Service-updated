import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '64.225.21.133',
  user: process.env.DB_USER || 'u1_fPQ831rGsr',
  password: process.env.DB_PASSWORD || '=2Tr+I.KIJ0BX!F3=qUvTz5R',
  database: process.env.DB_NAME || 's1_taskmanagement',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
