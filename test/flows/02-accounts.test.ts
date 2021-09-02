import 'jest';
import 'reflect-metadata';
import request, { SuperTest, Test } from 'supertest';
import { closeDb } from '../../src/data/base';
import { Account } from '../../src/models/account';
import { fetchUserToken } from '../common/sign_in';
import { getApp } from '../server';

const user = {
  email: 'sample@wherever.com',
  password: 'anythingElse',
};

describe('Managing account', () => {
  let app: SuperTest<Test>;
  let token: string;
  let account = {} as Account;

  beforeAll(async () => {
    app = request(getApp());
    token = await fetchUserToken(app);
  });

  test('Can view account details', async () => {
    const res = await app.get('/api/v1/accounts').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    account = res.body;
    expect(account.userName).toBe('sample');
  });

  test('Can update account details', async () => {
    const update = { ...account, userName: 'New Sample' };
    const res = await app
      .put('/api/v1/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send(update);
    expect(res.statusCode).toBe(200);

    const aRes = await app.get('/api/v1/accounts').set('Authorization', `Bearer ${token}`);
    expect(aRes.statusCode).toBe(200);

    account = aRes.body;
    expect(account.userName).toBe('New Sample');
  });

  afterAll(() => closeDb());
});
