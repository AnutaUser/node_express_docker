import { compare, hash } from 'bcrypt';

import { configs } from '../configs';

class PasswordService {
  public async hash(password: string): Promise<string> {
    return await hash(password, +configs.SALT);
  }
  public async compare(password: string, hashPass: string): Promise<boolean> {
    return await compare(password, hashPass);
  }
}

export const passwordService = new PasswordService();
