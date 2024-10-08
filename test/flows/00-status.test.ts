import 'jest';
import 'reflect-metadata';
import request from 'supertest';
import { getApp } from '../server';
import TestAgent from 'supertest/lib/agent';

describe('Checking status', () => {
  let app: TestAgent;

  beforeAll(async () => {
    app = request(getApp());
  });

  test('Health check should be working', async () => {
    const res = await app.get('/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ api: 'UP' });
  });

  test('Errors should be rippling properly', async () => {
    const res = await app.get('/status/error');
    expect(res.statusCode).toBe(500);
  });

  test('Internal Health check should fail without Auth', async () => {
    const res = await app.get('/api/v1/status');
    expect(res.statusCode).toBe(401);
  });

  test('Invalid urls give a not found', async () => {
    const oRes = await app
      .get('/something-random');
    expect(oRes.statusCode).toBe(404);
  });
});
