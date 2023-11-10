import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';
import { userService } from '../services';
import { IUser } from '../types';
import { UserValidator } from '../validators';

class UserController {
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findAll();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const createUser = await userService.create(req.res.locals as IUser);

      return res.status(201).json(createUser);
    } catch (e) {
      next(e);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const userById = await userService.getById(req.params.userId);

      return res.status(200).json(userById);
    } catch (e) {
      next(e);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { error, value } = UserValidator.update.validate(req.body);

      if (error) {
        throw new ApiError(error.message, 400);
      }

      const updateUser = await userService.update(req.params.userId, value);

      return res.status(201).json(updateUser);
    } catch (e) {
      next(e);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await userService.delete(req.params.userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
