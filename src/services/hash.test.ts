import 'reflect-metadata';
import { HashingService } from './hash';

describe('Both ways', () => {
  let service: HashingService;

  beforeAll(() => {
    service = new HashingService();
  });

  test('Hashing and verifying', async () => {
    const result = await service.withSalt('password');

    const success = await service.verify(result, 'password');
    expect(success).toBe(true);
  });

  test('Failed verification', async () => {
    const result = await service.withSalt('password');

    const success = await service.verify(result, 'else');
    expect(success).toBe(false);
  });
});
