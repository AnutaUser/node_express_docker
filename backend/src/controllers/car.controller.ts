import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';

import { ApiError } from '../errors';
import { carMapper } from '../mappers';
import { carService } from '../services';
import { ICar, IQuery, ITokenPayload } from '../types';

class CarController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar[]>> {
    try {
      const response = await carService.getAll(req.query as unknown as IQuery);

      const cars = response.data.map((car) => {
        return carMapper.carForResponse(car);
      });

      return res.status(200).json({
        ...response,
        data: cars,
      });
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar>> {
    try {
      const { _id } = req.res.locals.tokenPayload as ITokenPayload;

      const car = await carService.create(req.body, _id);
      const carForResponse = carMapper.carForResponse(car);

      return res.status(200).json(carForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar>> {
    try {
      const car = await carService.getById(req.params.carId);
      const carForResponse = carMapper.carForResponse(car);

      return res.status(200).json(carForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar>> {
    try {
      const { carId } = req.params;

      const car = await carService.update(carId, req.body);
      const carForResponse = carMapper.carForResponse(car);

      return res.status(200).json(carForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await carService.delete(req.params.carId);

      return res.sendStatus(204);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async uploadPhoto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar>> {
    try {
      const { carId } = req.params;

      const photo = req.files.photo as UploadedFile;

      const car = await carService.uploadPhoto(photo, carId);

      const carForResponse = carMapper.carForResponse(car);

      return res.status(201).json(carForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async deletePhoto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { car } = req.res.locals;

      await carService.deletePhoto(req.params.carId, car);
      res.sendStatus(204);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const carController = new CarController();
