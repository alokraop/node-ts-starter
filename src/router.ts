import { Express, Router } from 'express';
import { accountRouter } from './controllers/account';
import { authRouter } from './controllers/auth';
import { APIError } from './middleware/error';
import { statusRouter } from './controllers/status';

export function setupRoutes(webServer: Express) {
  const v1Router = Router();
  v1Router.use('/status', statusRouter);
  v1Router.use('/auth', authRouter);
  v1Router.use('/accounts', accountRouter);
  v1Router.use('*', (_, __) => {
    throw new APIError('This endpoint does not exist on the API', 404);
  });

  webServer.use('/status', statusRouter);
  webServer.use('/api/v1', v1Router);
  webServer.get('*', (_, __) => {
    throw new APIError('This endpoint does not exist on the API', 404);
  });
}
