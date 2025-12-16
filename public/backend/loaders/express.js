import express from 'express';
import routes from "../routes/index.js"; 
import cors from 'cors';

export default function expressLoader({ app}) {
  app.use(cors());
  app.use(express.json()); 
  app.use('/api',routes);
}
