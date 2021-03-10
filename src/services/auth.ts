import { Service } from 'typedi';
import { APIError } from '../controllers/middleware/error';
import { Account, Credentials } from '../models/account';
import { AccountService } from './account';
import { HashingService } from './hash';
import { LoggingService } from './logging';
import { TokenService } from './token';

@Service()
export class AuthService {
  constructor(
    private service: AccountService,
    private logger: LoggingService,
    private token: TokenService,
    private hasher: HashingService,
  ) {}

  async signUp(creds: Credentials): Promise<string> {
    if (this.service.emailExists(creds.email)) {
      throw new APIError('An account with this email exists');
    }
    this.logger.debug('Creating new account', { accountId: creds.email });
    const hash = await this.hasher.withSalt(creds.password);
    const account = <Account>{
      id: creds.email,
      hashedPassword: hash,
      userName: creds.email.split('@')[0],
    };
    await this.service.create(account);
    return this.token.create(creds.email);
  }

  async signIn(creds: Credentials): Promise<string> {
    const account = await this.service.fetch(creds.email);
    if (!account) throw new APIError("The account you're signing into doesn't exist");
    const { cipher, salt } = account.hashedPassword;

    const hash = await this.hasher.withSalt(creds.password, salt);
    if (hash.cipher !== cipher) throw new APIError('The email/password you provided was incorrect');
    return this.token.create(creds.email);
  }
}
