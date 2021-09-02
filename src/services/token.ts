import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { logger } from '../util/logger';
import { ConfigService } from './config';

@Service()
export class TokenService {
  constructor(private config: ConfigService) {}

  create(value: string): string {
    return jwt.sign(value, this.config.signingKey);
  }

  verify(token: any): string | undefined {
    if (!token || typeof token !== 'string') return;
    try {
      const accountId = jwt.verify(token, this.config.signingKey, {});
      if (accountId && typeof accountId == 'string') {
        return accountId;
      }
    } catch (e) {
      logger.warn(`Token verification failed: ${e}`);
    }
  }
}
