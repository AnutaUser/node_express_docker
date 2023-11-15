import { ApiError } from '../errors';
import { User } from '../models';
import { userRepository } from '../repositories';
import { IUser } from '../types';

class UserService {
  public async findAll(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getById(userId: string): Promise<IUser> {
    return await this.getOneByIdOrThrow(userId);
  }

  public async update(userId: string, data: IUser): Promise<IUser> {
    await this.getOneByIdOrThrow(userId);

    return await userRepository.update(userId, data);
  }

  public async delete(userId: string): Promise<void> {
    await this.getOneByIdOrThrow(userId);
    await User.findByIdAndDelete(userId);
  }

  private async getOneByIdOrThrow(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 422);
    }
    return user;
  }
}

export const userService = new UserService();
