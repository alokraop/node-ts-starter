import 'reflect-metadata';
import { Authenticate } from './auth';
import Container from 'typedi';
import { TokenService } from '../services/token';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { ConfigService } from '../services/config';
jest.mock('../services/token');

describe('All auth variations', () => {
  beforeAll(() => {
    const verify = TokenService.prototype.verify as jest.Mock;
    verify.mockImplementation((token: string) => {
      return token === 'good' ? 'test-id' : undefined;
    });
    const config = new ConfigService();
    const token = new TokenService(config);
    Container.set(TokenService, token);
  });

  test('Good token', () => {
    const req = getMockReq({ headers: { token: 'good' } });
    const { res, next } = getMockRes();
    Authenticate(req, res, next);

    expect(res.locals.accountId).toBe('test-id');
    expect(next).toBeCalledTimes(1);
  });

  test('Bad token', () => {
    const req = getMockReq({ headers: { token: 'bad' } });
    const { res, next } = getMockRes();
    try {
      Authenticate(req, res, next);
    } catch (e) {
      expect(e.message).toBe('Invalid or missing token');
    }
    expect(next).toBeCalledTimes(0);
  });
});
