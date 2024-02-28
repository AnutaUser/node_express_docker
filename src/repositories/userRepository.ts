import { ApiError } from '../errors';
import { User } from '../models';
import { IPaginationResponse, IQuery, IUser } from '../types';

class UserRepository {
  public async getAll(query: IQuery): Promise<IPaginationResponse<IUser>> {
    try {
      const queryStr = JSON.stringify(query);

      const queryObj = JSON.parse(
        queryStr.replace(/\b(lte|gte|lt|gt)\b/, (match) => `$${match}`),
      );

      const {
        page = 1,
        limit = 5,
        sortedBy = 'createdBy',
        ...searchObj
      } = queryObj;

      const skip = +limit * (+page - 1);
      const users = await User.find(searchObj)
        .limit(+limit)
        .skip(skip)
        .sort(sortedBy);

      const count = await User.countDocuments();

      return {
        page,
        perPage: +limit,
        itemsCount: count,
        itemsFound: users.length,
        data: users,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async update(userId: string, data: Partial<IUser>): Promise<IUser> {
    try {
      return await User.findByIdAndUpdate(userId, data, {
        returnDocument: 'after',
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userRepository = new UserRepository();
