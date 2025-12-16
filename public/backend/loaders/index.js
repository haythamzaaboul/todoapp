import express from 'express';
import expressLoader from './express.js';
import postgresLoader from './postgresLoader.js';

export default async function createApp() {
  const app = express();
  const db = await postgresLoader();
  app.locals.db = db;

  expressLoader({ app });
  return app;
}
