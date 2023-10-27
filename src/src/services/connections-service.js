import db from '../config/db.js';

export const CurrentUsersService = async (filter, options) => {
    // Perform the MySQL query
    const [rows, fields] = await db.execute('SELECT * FROM Session WHERE Active = true', filter);

    // Release the connection back to the pool
    db.release();

    return rows;
};

export const graphService = async (filter, options) => {
    // Perform the MySQL query
    const [rows, fields] = await db.execute('SELECT SourceIp FROM Session WHERE Active = true', filter);

    // Release the connection back to the pool
    db.release();

    return rows;
};


export const historicalUsersService = async (filter, options) => {
    // Perform the MySQL query
    const [rows, fields] = await db.execute('SELECT * FROM Session WHERE Active = false', filter);

    // Release the connection back to the pool
    db.release();

    return rows;
};