import { Service } from 'typedi';
import { AccountDao } from '../data/accounts';
import { APIError } from '../middleware/error';
import { Account } from '../models/account';

@Service()
export class AccountService {
  constructor(private dao: AccountDao) {}

  async emailExists(email: string): Promise<boolean> {
    try {
      await this.findByEmail(email);
      return true;
    } catch (e) {
      return false;
    }
  }

  async findByEmail(email: string): Promise<Account> {
    const account = await this.dao.findFirst({ email });
    if (!account) throw new APIError(`No account found for email: ${email}`, 404);
    return account;
  }

  async fetch(id: string): Promise<Account> {
    const account = await this.dao.fetch(id, { hashedPassword: 0 });
    if (!account) throw new APIError(`No account found for id: ${id}`, 404);
    return account;
  }

  async create(account: Account): Promise<any> {
    return this.dao.save(account);
  }

  async update(account: Account): Promise<any> {
    return this.dao.update({ _id: account._id }, account);
  }
}
