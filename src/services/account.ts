import { Service } from 'typedi';
import { AccountDao } from '../data/accounts';
import { Account } from '../models/account';

@Service()
export class AccountService {
  constructor(private dao: AccountDao) {}

  async emailExists(email: string): Promise<boolean> {
    const account = await this.findByEmail(email);
    return !!account;
  }

  async findByEmail(email: string): Promise<Account> {
    return this.dao.find({ email });
  }

  async fetch(id: string): Promise<Account> {
    return this.dao.fetch(id, { hashedPassword: 0 });
  }

  async create(account: Account): Promise<any> {
    return this.dao.save(account);
  }

  async update(account: Account): Promise<any> {
    return this.dao.update({ id: account.id }, account);
  }
}
