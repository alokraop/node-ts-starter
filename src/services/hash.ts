import { Service } from 'typedi';

import crypto from 'crypto';
import { HashResult } from '../models/internal';
import { LoggingService } from './logging';

@Service()
export class HashingService {
  constructor(public logger: LoggingService) {}

  async withSalt(value: string): Promise<HashResult> {
    const salt = crypto.randomBytes(16).toString('hex');
    this.logger.debug(`Hashing ${value} with ${salt}`);
    const key = await this.createHash(value, salt);
    return new HashResult(key.toString('hex'), salt);
  }

  private async createHash(value: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(value, salt, 64, (err, key) => {
        if (err) reject(err);
        resolve(key);
      });
    });
  }

  async verify(hash: HashResult, value: string): Promise<boolean> {
    const aKey = Buffer.from(hash.cipher, 'hex');
    const key = await this.createHash(value, hash.salt);
    return crypto.timingSafeEqual(key, aKey);
  }
}
