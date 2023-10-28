import mysql from 'mysql2/promise.js';
import config from './config.js';

console.log(config)

const pool = mysql.createPool({
    host: config.mysql.host, // Database host (change it to your MySQL host)
    user: config.mysql.user, // Database username
    password: config.mysql.password, // Database password
    database: config.mysql.database // Database name
});
export default pool;
