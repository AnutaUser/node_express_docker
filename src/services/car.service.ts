import { UploadedFile } from 'express-fileupload';
import { Types } from 'mongoose';

import { EFileType } from '../enums';
import { ApiError } from '../errors';
import { Car } from '../models';
import { carRepository } from '../repositories';
import { ICar, IPaginationResponse, IQuery } from '../types';
import { s3Service } from './s3.service';

class CarService {
  public async getAll(query: IQuery): Promise<IPaginationResponse<ICar>> {
    try {
      return await carRepository.getAll(query);
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

  public async uploadPhoto(
    photo: UploadedFile,
    carId: Types.ObjectId | string,
  ): Promise<ICar> {
    try {
      const carPhoto = await s3Service.uploadFile(
        photo,
        EFileType.carPhoto,
        carId,
      );

      return await Car.findByIdAndUpdate(
        carId,
        {
          $set: { photo: carPhoto },
        },
        { returnDocument: 'after' },
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async deletePhoto(carId: string, car: ICar): Promise<void> {
    try {
      await Promise.all([
        s3Service.deletedFile(car.photo),
        Car.findByIdAndUpdate(
          carId,
          { $unset: { photo: car.photo } },
          { returnDocument: 'after' },
        ),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const carService = new CarService();
