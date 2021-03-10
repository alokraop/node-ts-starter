import { Service } from 'typedi';
import { AccountDao } from '../data/accounts';
import { Account } from '../models/account';

@Service()
export class AccountService {
  constructor(private dao: AccountDao) {}

  async emailExists(email: string): Promise<boolean> {
    const account = await this.fetch(email);
    return !!account;
  }

  async fetch(id: string): Promise<Account> {
    return this.dao.fetch(id, { password: 0 });
  }
  
  async create(account: Account): Promise<any> {
    return this.dao.save(account);
  }

  async update(account: Account): Promise<any> {
    return this.dao.update({ id: account.id }, account);
  }
}
