import expressLoader from "./express.js"; 
import {postgresLoader} from "./postgresLoader.js"

export default async function loadApp({app}) {
  const db = await postgresLoader(); 
  app.locals.db = db 
  await expressLoader({app}); 
  return {db}
}
