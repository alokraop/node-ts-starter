import { Service } from 'typedi';
import { APIError } from '../middleware/error';
import { Account, Credentials } from '../models/account';
import { AccountService } from './account';
import { HashingService } from './hash';
import { TokenService } from './token';
import { v1 as uuid } from 'uuid';
import { logger } from '../util/logger';

@Service()
export class AuthService {
  constructor(
    private service: AccountService,
    private token: TokenService,
    private hasher: HashingService,
  ) {}

  async signUp(creds: Credentials): Promise<string> {
    const exists = await this.service.emailExists(creds.email);
    if (exists) {
      throw new APIError('An account with this email exists', 409);
    }
    logger.debug('Creating new account', { accountId: creds.email });
    const hash = await this.hasher.withSalt(creds.password);
    const account = <Account>{
      _id: uuid(),
      email: creds.email,
      hashedPassword: hash,
      userName: creds.email.split('@')[0],
    };
    await this.service.create(account);
    return this.token.create(account._id);
  }

  async signIn(creds: Credentials): Promise<string> {
    const account = await this.service.findByEmail(creds.email);
    if (!account) throw new APIError("The account you're signing into doesn't exist", 404);
    const same = await this.hasher.verify(account.hashedPassword, creds.password);
    if (!same) throw new APIError('The email or password you provided was incorrect', 401);
    return this.token.create(account._id);
  }
}
