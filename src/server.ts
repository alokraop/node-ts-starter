import 'express-async-errors';

import express, { NextFunction, Request, Response, Express, RequestHandler } from 'express';
import { Server } from 'http';
import { HandleErrors } from './middleware/error';
import { setupRoutes } from './router';
import { ConfigService } from './services/config';
import morgan from 'morgan';
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
  morgan.token('message', (_, res: Response) => res.locals.description);
  app.use(
    morgan(jsonFormat, {
      stream: { write: logJson },
      skip: (req: Request, _) => req.originalUrl.endsWith('status'),
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

const jsonFormat: morgan.FormatFn<Request, Response> = (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    'user-agent': tokens['user-agent'](req, res),
    response_time: tokens['response-time'](req, res) + ' ms',
    message: tokens.message(req, res),
  });
};

function logJson(log: string) {
  const { message, ...attributes } = JSON.parse(log);
  logger.info(message, attributes);
}
