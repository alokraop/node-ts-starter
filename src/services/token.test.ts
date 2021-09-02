import 'reflect-metadata';
import { TokenService } from './token';
import { ConfigService } from './config';

describe('Checking all methods', () => {
  let service: TokenService;

  beforeAll(() => {
      const config = new ConfigService();
      service = new TokenService(config);
  });

  test('Create token', () => {
    const token = service.create('sample-id');
    expect(token).toBe(
      'eyJhbGciOiJIUzI1NiJ9.c2FtcGxlLWlk.9dhnDI2bIF0Dqz0dqzq60r1lW6B_FsQgAZBt0yBWrtQ',
    );
  });

  test('Verify token', () => {
    const value = service.verify(
      'eyJhbGciOiJIUzI1NiJ9.c2FtcGxlLWlk.9dhnDI2bIF0Dqz0dqzq60r1lW6B_FsQgAZBt0yBWrtQ',
    );
    expect(value).toBe('sample-id');
  });

  test('Invalid token', () => {
    const value = service.verify('eyJ');
    expect(value).toBe(undefined);
  });
});
