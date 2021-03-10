import { Service } from 'typedi';

import crypto from 'crypto';
import { HashResult } from '../models/internal';
import { LoggingService } from './logging';

@Service()
export class HashingService {
  constructor(private logger: LoggingService) {}

  withSalt(value: string, defSalt?: string): Promise<HashResult> {
    const salt = defSalt ?? crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
      this.logger.debug(`Hashing ${value} with ${salt}`);
      crypto.scrypt(value, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(new HashResult(salt, derivedKey.toString('hex')));
      });
    });
  }
}
