import { Types } from 'mongoose';

import { ApiError } from '../errors';
import { Car } from '../models';
import { ICar } from '../types';

class CarService {
  public async getAll(): Promise<ICar[]> {
    try {
      return await Car.find();
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async create(body: ICar, userId: string): Promise<ICar> {
    try {
      return await Car.create({ ...body, _user: new Types.ObjectId(userId) });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getById(carId: string): Promise<ICar> {
    try {
      return await Car.findById(carId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async update(carId: string, body: Partial<ICar>): Promise<ICar> {
    try {
      return await Car.findByIdAndUpdate(carId, body, {
        returnDocument: 'after',
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async delete(carId: string): Promise<void> {
    try {
      return await Car.findByIdAndDelete(carId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const carService = new CarService();
