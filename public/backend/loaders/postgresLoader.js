import pg from "pg"; 
import config from "../config/config.js"
const  {Pool} = pg;


export default async function postgresLoader() {
  const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  console.log('PostgreSQL connected');

  return pool;
}
