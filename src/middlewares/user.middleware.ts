import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';
import { User } from '../models';

class UserMiddleware {
  public isUserExist<T>(field: keyof T) {
    return async (
      req: Request,
      _res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const user = await User.findOne({ [field]: req.body[field] });

        if (!user) {
          throw new ApiError('User not found', 422);
        }

        req.res.locals.user = user;
        next();
      } catch (e) {
        next(new ApiError(e.message, e.status));
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();
