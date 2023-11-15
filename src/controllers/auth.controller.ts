import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';
import { authService } from '../services';
import { ITokenPair } from '../types';

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await authService.register(req.body);
      return res.sendStatus(201);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokenPair>> {
    try {
      const tokensPair = await authService.login(req.body, req.res.locals.user);
      return res.status(201).json(tokensPair);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const authController = new AuthController();
