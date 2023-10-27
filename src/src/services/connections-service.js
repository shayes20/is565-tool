import fetch from 'node-fetch';
import db from '../config/db.js';
import asyncForEach from '../utils/async-for-each.js';

export const currentConnectionsService = async () => {
    // Perform the MySQL query
    const [results] = await db.execute(
        'SELECT * FROM Session WHERE Active = 1'
    );

    // Release the connection back to the pool
    db.release();

    return results;
};

export const graphService = async () => {
    // Perform the MySQL query
    const [results] = await db.execute(
        'SELECT SourceIp FROM Session WHERE Active = 1'
    );

    // Release the connection back to the pool
    db.release();

    // Create a map with IP address as key and country as value
    const ipCountryMap = {};

    // Find the country of origin for the ip address
    await asyncForEach(results, async (result) => {
        const sourceIp = result.SourceIP;

        const [country] = await fetch(`https://api.country.is/${sourceIp}`);

        ipCountryMap[sourceIp] = country;
    });

    return ipCountryMap;
};

export const historicalConnectionsService = async () => {
    // Perform the MySQL query
    const [results] = await db.execute('SELECT * FROM Session');

    // Release the connection back to the pool
    db.release();

    return results;
};
