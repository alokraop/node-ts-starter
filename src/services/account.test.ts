import 'reflect-metadata';
import { AccountDao } from '../data/accounts';
import { APIError } from '../middleware/error';
import { AccountService } from './account';
jest.mock('../data/accounts');

const user = {
  _id: 'some-id',
  userName: 'smple',
  email: 'sample@somewhere.com',
  hashedPassword: { salt: '', cipher: '' },
};

describe('Checking account management', () => {
  let dao: AccountDao;
  let service: AccountService;

  beforeAll(() => {
    dao = new AccountDao();
    service = new AccountService(dao);
  });

  test('Create works', async () => {
    service.create(user);
    expect(dao.save).toBeCalled();
  });

  test('Create works', async () => {
    service.update(user);
    expect(dao.update).toBeCalled();
  });

  test('Can fetch by id', async () => {
    const find = AccountDao.prototype.fetch as jest.Mock;
    find.mockImplementation((_id) => user._id === _id ? user : undefined);

    const result = await service.fetch('some-id');
    expect(result.email).toBe(user.email);

    await expect(() => service.fetch('e')).rejects.toThrow(APIError);
  });

  test('Can fetch by email', async () => {
    const find = AccountDao.prototype.findFirst as jest.Mock;
    find.mockImplementation((q) => user.email ===  q.email ? user : undefined);

    const result = await service.findByEmail('sample@somewhere.com');
    expect(result._id).toBe(user._id);

    await expect(() => service.findByEmail('sample@nowhere.com')).rejects.toThrow(APIError);
  });

  test('Can check account exists', async () => {
    const find = AccountDao.prototype.findFirst as jest.Mock;
    find.mockImplementation((q) => user.email ===  q.email ? user : undefined);

    const exists = await service.emailExists('sample@somewhere.com');
    expect(exists).toBe(true);

    const doesnt = await service.emailExists('sample@nowhere.com');
    expect(doesnt).toBe(false);
  });
});
