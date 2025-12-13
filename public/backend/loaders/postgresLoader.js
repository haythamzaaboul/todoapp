import pg from "pg"; 
import config from "../config/config.js"
const  {Pool} = pg;


export async function postgreLoader() {
  const pool = new Pool({connectionString : config.databaseURL});

  const c = await pool.connect(); 
  try{
    await c.query("SELECT 1");
    console.log("Postgres Connected");
  }finally {
    c.release();
  }
}
