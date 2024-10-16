import { createClient } from "redis";

/*  PRODUCTIONUPDATES
const client = createClient({password: process.env.REDIS_PASSWORD, socket: {
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT || "11339")
}});
*/

const client = createClient();
client.connect();
client.on('error', (err) => console.log('Redis Client Error', err));


export { client }
