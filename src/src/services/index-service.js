import db from "../config/db.js"
export const queryUsersService = async (filter, options) => {



        // Perform the MySQL query
        const [rows, fields] = await db.execute('SELECT * FROM tableName', filter);

        // Release the connection back to the pool
        db.release();

        return rows;
};
