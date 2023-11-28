import { NextFunction, Request, Response } from 'express';

import { ETokenType } from '../enums';
import { ApiError } from '../errors';
import { Token } from '../models';
import { tokenService } from '../services';

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accessToken = req.get('Authorization');

      if (!accessToken) {
        throw new ApiError(`No token`, 401);
      }

      const tokenPayload = tokenService.checkToken(
        accessToken,
        ETokenType.Access,
      );

      const entity = await Token.findOne({ accessToken });

      if (!entity) {
        throw new ApiError(`Not valid token`, 401);
      }

      req.res.locals.tokenPayload = tokenPayload;
      req.res.locals.entity = entity;

      next();
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async checkRefreshToken(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.get('Authorization');

      if (!refreshToken) {
        throw new ApiError(`No token`, 401);
      }

      const tokenPayload = tokenService.checkToken(
        refreshToken,
        ETokenType.Refresh,
      );

      const entity = await Token.findOne({ refreshToken });

      if (!entity) {
        throw new ApiError('Not valid token', 401);
      }

      req.res.locals.tokenPayload = tokenPayload;
      req.res.locals.oldTokensPair = entity;

      next();
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const authMiddleware = new AuthMiddleware();
