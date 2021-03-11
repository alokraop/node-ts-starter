import 'express-async-errors';
import 'reflect-metadata';

import express from 'express';
import { setupRoutes } from './router';

export function createWebServer() {
  const webServer = express();
  webServer.use(
    express.json({ limit: '5mb' }),
    express.urlencoded({
      limit: '5mb',
      extended: true,
    }),
  );

  setupRoutes(webServer);
  webServer.listen(9999, () => console.log('Running on port 9999'));
}

createWebServer();
