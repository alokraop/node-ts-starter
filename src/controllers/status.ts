import { Request, Response, Router } from 'express';

export const statusRouter = Router();

statusRouter.get('/', (_: Request, res: Response) => {
  res.json({
    api: 'UP',
  });
});

statusRouter.get('/error', (_: Request, res: Response) => {
  throw new Error('Something is wrong!');
});
