import mysql from 'mysql2/promise';
import config from './config';

const pool = mysql.createPool({
  host: 'localhost', // Database host (change it to your MySQL host)
  user: 'your_username', // Database username
  password: 'your_password', // Database password
  database: 'your_database_name', // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
export default pool;