import 'express-async-errors';

import express, { NextFunction, Request, Response, Express, RequestHandler } from 'express';
import { Server } from 'http';
import { HandleErrors } from './middleware/error';
import { setupRoutes } from './router';
import { ConfigService } from './services/config';
import morgan from 'morgan';
import json from 'morgan-json';
import cors from 'cors';
import { Authenticate } from './middleware/auth';
import { logger } from './util/logger';

export let webServer: Server;

export function createServer(config: ConfigService): Express {
  const app = express();

  // CORS
  app.use(cors());

  // Size cap
  app.use(
    express.json({ limit: '5mb' }),
    express.urlencoded({
      limit: '5mb',
      extended: true,
    }),
  );

  // Request logging
  app.use(
    morgan(json(':method :url :status ":user-agent" :response-time ms'), {
      stream: { write: (log) => logger.info('New Request', JSON.parse(log)) },
    }),
  );

  // Authentication
  app.use('/api', Unless('/v1/auth', Authenticate));

  setupRoutes(app);

  // Error handling
  app.use(HandleErrors);

  return app;
}

function Unless(prefix: string, middleware: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`Path - ${req.path}`);
    if (req.path.startsWith(prefix)) {
      next();
    } else {
      middleware(req, res, next);
    }
  };
}
