import mysql from 'mysql2/promise.js';
import config from './config.js';

const pool = mysql.createPool({
    host: config.host, // Database host (change it to your MySQL host)
    user: config.user, // Database username
    password: config.password, // Database password
    database: config.database // Database name
});
export default pool;
