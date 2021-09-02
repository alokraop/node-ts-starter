import 'jest';
import 'reflect-metadata';
import request, { SuperTest, Test } from 'supertest';
import { closeDb } from '../../src/data/base';
import { getApp } from '../server';

const user = {
  email: 'sample@wherever.com',
  password: 'anythingElse',
};

describe('Signing up and signing in', () => {
  let app: SuperTest<Test>;

  beforeAll(async () => {
    app = request(getApp());
  });

  test('Can sign-up with a new email', async () => {
    const res = await app.post('/api/v1/auth/sign-up').send(user);
    expect(res.statusCode).toBe(201);

    const sRes = await app.get('/api/v1/status').set('Authorization', `Bearer ${res.body.token}`);
    expect(sRes.statusCode).toBe(200);
  });

  test('Can sign-in with existing email', async () => {
    const res = await app.post('/api/v1/auth/sign-in').send(user);
    expect(res.statusCode).toBe(200);

    console.log(res.body.token);
    const sRes = await app.get('/api/v1/status').set('Authorization', `Bearer ${res.body.token}`);
    expect(sRes.statusCode).toBe(200);
  });

  test('Wrong password during sign-in gives unauthorized', async () => {
    const res = await app.post('/api/v1/auth/sign-in').send({ ...user, password: 'short' });
    expect(res.statusCode).toBe(422);

    const sRes = await app.post('/api/v1/auth/sign-in').send({ ...user, password: 'longButWrong' });
    expect(sRes.statusCode).toBe(401);
  });

  test('Non existent account during sign-in gives not found', async () => {
    const res = await app
      .post('/api/v1/auth/sign-in')
      .send({ ...user, email: 'wrong@somewhere.com' });
    expect(res.statusCode).toBe(404);
  });

  test('Duplicate sign-up gives conflict', async () => {
    const res = await app.post('/api/v1/auth/sign-up').send(user);
    expect(res.statusCode).toBe(409);
  });

  afterAll(() => closeDb());
});
