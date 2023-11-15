import { User } from '../models';
import { IUser } from '../types';

class UserRepository {
  public async update(userId: string, data: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, data, {
      returnDocument: 'after',
    });
  }
}

export const userRepository = new UserRepository();
