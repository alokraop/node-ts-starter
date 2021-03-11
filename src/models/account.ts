import { Allow, IsDefined, IsEmail, MinLength } from 'class-validator';
import { HashResult } from './internal';

export class Credentials {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @MinLength(8)
  password: string;
}

export class Account {
  @IsDefined()
  id: string;

  @IsEmail()
  email: string;

  hashedPassword: HashResult;

  @Allow()
  userName: string;
}
