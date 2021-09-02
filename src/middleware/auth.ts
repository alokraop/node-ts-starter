import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { TokenService } from '../services/token';
import { APIError } from './error';

export function Authenticate(req: Request, res: Response, next: NextFunction) {
  const service = Container.get(TokenService);
  const token = req.headers.authorization?.substring('Bearer '.length);
  const accountId = service.verify(token);
  if (!accountId) throw new APIError('Invalid or missing token', 401);
  res.locals = { accountId };
  next();
}
