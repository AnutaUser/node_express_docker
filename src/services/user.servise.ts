import { ApiError } from '../errors';
import { User } from '../models';
import { IUser } from '../types';

class UserService {
  public async findAll(): Promise<IUser[]> {
    try {
      return await User.find().select('-password');
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async create(data: IUser): Promise<IUser> {
    try {
      return await User.create(data);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getById(userId: string): Promise<IUser> {
    try {
      return await User.findById(userId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async update(userId: string, data: IUser): Promise<IUser> {
    try {
      return await User.findByIdAndUpdate(userId, data, {
        returnDocument: 'after',
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async delete(userId: string): Promise<void> {
    try {
      await User.findByIdAndDelete(userId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userService = new UserService();
