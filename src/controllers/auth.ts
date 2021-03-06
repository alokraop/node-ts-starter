import { Router, Request, Response } from 'express';
import { Credentials } from '../models/account';
import { Validate } from '../middleware/validation';
import { Container } from 'typedi';
import { AuthService } from '../services/auth';

export const authRouter: Router = Router();

const service = () => Container.get(AuthService);

authRouter.post('/sign-up', Validate(Credentials), async (req: Request, res: Response) => {
  const token = await service().signUp(req.body);
  res.status(201).json({ message: 'Account Created', token: token });
});

authRouter.post('/sign-in', Validate(Credentials), async (req: Request, res: Response) => {
  const token = await service().signIn(req.body);
  res.status(200).json({ message: 'Credentials verified', token: token });
});
