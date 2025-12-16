import pg from "pg"; 
import config from "../config/config.js"
const  {Pool} = pg;


export default async function postgresLoader() {
  const pool = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  console.log('PostgreSQL connected');

  return pool;
}
