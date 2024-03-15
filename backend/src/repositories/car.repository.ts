import { ApiError } from '../errors';
import { Car } from '../models';
import { ICar, IPaginationResponse, IQuery } from '../types';

class CarRepository {
  public async getAll(query: IQuery): Promise<IPaginationResponse<ICar>> {
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

      const skip = limit * (page - 1);

      const cars = await Car.find(searchObj)
        .limit(limit)
        .skip(skip)
        .sort(sortedBy);

      const count = await Car.countDocuments();

      return {
        page,
        perPage: limit,
        itemsCount: count,
        itemsFound: cars.length,
        data: cars,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const carRepository = new CarRepository();
