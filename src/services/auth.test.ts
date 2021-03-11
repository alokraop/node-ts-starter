import { AccountDao } from '../data/accounts';
import { Account } from '../models/account';
import { HashResult } from '../models/internal';
import { AccountService } from './account';
import { AuthService } from './auth';
import { HashingService } from './hash';
import { LoggingService } from './logging';
import { TokenService } from './token';
jest.mock('./account');
jest.mock('../data/accounts');
jest.mock('./hash');
jest.mock('./logging');
jest.mock('./token');

const creds = {
  email: 'abcd@example.com',
  password: 'password',
};

describe('Sign up tests', () => {
  let service: AuthService;

  beforeAll(() => {
    const create = TokenService.prototype.create as jest.Mock;
    create.mockImplementation((_: string) => 'some-token');

    const aService = new AccountService(new AccountDao());
    const logger = new LoggingService();
    const token = new TokenService(logger);
    const hasher = new HashingService(logger);
    service = new AuthService(aService, logger, token, hasher);
  });

  test('Successful', async () => {
    const emailExists = AccountService.prototype.emailExists as jest.Mock;
    emailExists.mockImplementation((_: string) => false);
    const token = await service.signUp(creds);
    expect(token).toBe('some-token');
    expect(emailExists).toBeCalledTimes(1);
  });

  test('Duplicate', async () => {
    const emailExists = AccountService.prototype.emailExists as jest.Mock;
    emailExists.mockClear();
    emailExists.mockImplementation((_: string) => true);
    try {
      await service.signUp(creds);
    } catch (e) {
      expect(e.message).toBe('An account with this email exists');
    }
    expect(emailExists).toBeCalledTimes(1);
  });
});

describe('Sign in tests', () => {
  let service: AuthService;

  beforeAll(() => {
    const create = TokenService.prototype.create as jest.Mock;
    create.mockImplementation((_: string) => 'some-token');

    const findByEmail = AccountService.prototype.findByEmail as jest.Mock;
    findByEmail.mockImplementation((_: string) => {
      return <Account>{
        id: 'some-id',
        hashedPassword: {
          cipher: 'some-cipher',
          salt: 'some-salt',
        },
      };
    });

    const aService = new AccountService(new AccountDao());
    const logger = new LoggingService();
    const token = new TokenService(logger);
    const hasher = new HashingService(logger);
    service = new AuthService(aService, logger, token, hasher);
  });

  test('Successful', async () => {
    const verify = HashingService.prototype.verify as jest.Mock;
    verify.mockImplementation((_: HashResult, __: string) => true);

    const token = await service.signIn(creds);
    expect(token).toBe('some-token');

    expect(verify).toBeCalledTimes(1);
  });

  test('Incorrect password', async () => {
    const verify = HashingService.prototype.verify as jest.Mock;
    verify.mockClear();
    verify.mockImplementation((_: HashResult, __: string) => false);
    try {
      await service.signIn(creds);
    } catch (e) {
      expect(e.message).toBe('The email or password you provided was incorrect');
    }
    expect(verify).toBeCalledTimes(1);
  });

  test('Non-existant account', async () => {
    const findByEmail = AccountService.prototype.findByEmail as jest.Mock;
    findByEmail.mockClear();
    findByEmail.mockImplementation((_: string) => undefined);
    try {
      await service.signIn(creds);
    } catch (e) {
      expect(e.message).toBe("The account you're signing into doesn't exist");
    }
    expect(findByEmail).toBeCalledTimes(1);
  });
});
