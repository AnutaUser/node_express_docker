import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';
import { carService } from '../services';
import { ICar, ITokenPayload } from '../types';

class CarController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar[]>> {
    try {
      const cars = await carService.getAll();

      return res.status(200).json(cars);
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
      return res.status(200).json(car);
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
      return res.status(200).json(car);
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

      return res.status(200).json(car);
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
}

export const carController = new CarController();
