import fetch from 'node-fetch';
import db from '../config/db.js';
import asyncForEach from '../utils/async-for-each.js';

export const currentConnectionsService = async () => {
    // Perform the MySQL query
    const [results] = await db.execute(
        'SELECT SessionId, UserId, SourceIP, VPNIP,BytesIn BytesOut, ConnectedStart FROM Session WHERE Active = 1'
    );

    // Release the connection back to the pool
    // db.release();

    return results;
};

export const graphService = async () => {
    // Perform the MySQL query
    const [results] = await db.execute(
        'SELECT SourceIP FROM Session WHERE Active = 1'
    );

    // Release the connection back to the pool
    // db.release();

    // Create a map with IP address as key and country as value
    const ipCountryMap = {};

    // Find the country of origin for the ip address
    await asyncForEach(results, async (result) => {
        const sourceIp = result.SourceIP;

        if (sourceIp[0] == 1 && sourceIp[1] == 0 && sourceIp[2] == '.'){
            ipCountryMap[sourceIp] = "BYU";
        } else{

            try {
                const response = await fetch(`https://api.country.is/${sourceIp}`);
                if (!response.ok) {
                  throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                
                const data = await response.json(); 
                const { country } = data;
              
                ipCountryMap[sourceIp] = country;

              } catch (error) {
                console.error(`Error: ${error}`);
              }
              
        }

    });

    return ipCountryMap;
};

export const historicalConnectionsService = async () => {
    // Perform the MySQL query
    const [results] = await db.execute('SELECT SessionId, UserId, SourceIP, VPNIP,BytesIn BytesOut, ConnectedStart, ConnectedEnd FROM Session WHERE Active =0');

    // Release the connection back to the pool
    // db.release();

    return results;
};
