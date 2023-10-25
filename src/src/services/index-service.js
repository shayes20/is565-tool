import db from "../config/db.js"

const sql = `
    SELECT * FROM table1 WHERE condition1;
    SELECT * FROM table2 WHERE condition2;
    SELECT * FROM table3 WHERE condition3;
`;

const results = await queryUsersService(sql);

export const queryUsersService = async (results,fields) => {



        // Perform the MySQL query
        const [results, fields] = await db.execute(sql);
        // Release the connection back to the pool
        db.release();

        return rows;
};
