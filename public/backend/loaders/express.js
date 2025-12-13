import express from 'express';
import routes from "../routes/index.js"; 

export default function expressLoader({ app}) {
  const app = express();
  app.use(express.json()); 
  app.use('/api',routes);
}
