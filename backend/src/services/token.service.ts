import * as jwt from 'jsonwebtoken';

import { configs } from '../configs';
import { EActionTokenType, ETokenType } from '../enums';
import { ApiError } from '../errors';
import { ITokenPair, ITokenPayload } from '../types';

class TokenService {
  public async generateTokensPair(payload: ITokenPayload): Promise<ITokenPair> {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: configs.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: configs.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async generateActionToken(
    payload: ITokenPayload,
    tokenType: EActionTokenType,
  ): Promise<string> {
    try {
      let secret;
      let expiresIn;

      switch (tokenType) {
        case EActionTokenType.Activate:
          secret = configs.JWT_ACTIVATE_SECRET;
          expiresIn = configs.JWT_ACTIVATE_EXPIRES_IN;

          break;
        case EActionTokenType.Forgot:
          secret = configs.JWT_FORGOT_SECRET;
          expiresIn = configs.JWT_FORGOT_EXPIRES_IN;
          break;
      }

      return jwt.sign(payload, secret, { expiresIn });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public checkToken(
    token: string,
    tokenType: ETokenType | EActionTokenType,
  ): ITokenPayload {
    try {
      let secret: string;

      switch (tokenType) {
        case ETokenType.Access:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case ETokenType.Refresh:
          secret = configs.JWT_REFRESH_SECRET;
          break;
        case EActionTokenType.Activate:
          secret = configs.JWT_ACTIVATE_SECRET;
          break;
        case EActionTokenType.Forgot:
          secret = configs.JWT_FORGOT_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const tokenService = new TokenService();
