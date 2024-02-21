import { Types } from 'mongoose';

import {
  EActionTokenType,
  EEmailActions,
  ESmsActions,
  EStatus,
} from '../enums';
import { ApiError } from '../errors';
import { Action, OldPassword, Token, User } from '../models';
import { ICredential, ITokenPair, ITokenPayload, IUser } from '../types';
import { emailService } from './email.service';
import { passwordService } from './password.service';
import { smsService } from './sms.service';
import { tokenService } from './token.service';

class AuthService {
  public async register(body: IUser): Promise<void> {
    try {
      const { password, email, username, phone } = body;

      const hashedPassword = await passwordService.hash(password);

      const user = await User.create({ ...body, password: hashedPassword });

      const activateToken = await tokenService.generateActionToken(
        { _id: user._id },
        EActionTokenType.Activate,
      );

      await Promise.all([
        Action.create({
          actionToken: activateToken,
          actionType: EActionTokenType.Activate,
          _user: user._id,
        }),

        emailService.sendMail(email, EEmailActions.REGISTER, {
          username,
          activateToken,
        }),

        smsService.sendSMS(phone, ESmsActions.REGISTER, username),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredential,
    user: IUser,
  ): Promise<ITokenPair> {
    try {
      const isMatched = await passwordService.compare(
        credentials.password,
        user.password,
      );
      if (!isMatched) {
        throw new ApiError('wrong email or password', 401);
      }

      const tokenPair = await tokenService.generateTokensPair({
        _id: user._id,
        username: user.username,
      });

      await Token.create({ ...tokenPair, _user: user._id });
      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    oldTokensPair: ITokenPair,
    tokenPayload: ITokenPayload,
  ): Promise<ITokenPair> {
    try {
      const { _id, username } = tokenPayload;

      const tokensPair = await tokenService.generateTokensPair({
        _id,
        username,
      });

      await Promise.all([
        Token.create({ ...tokensPair, _user: _id }),
        Token.deleteOne({ refreshToken: oldTokensPair.refreshToken }),
      ]);

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
    _id: string,
  ): Promise<void> {
    try {
      const [user, userOldPassword] = await Promise.all([
        User.findById(_id),
        OldPassword.find({ _user: _id }),
      ]);

      const isCompere = await passwordService.compare(
        oldPassword,
        user.password,
      );

      if (!isCompere) {
        throw new ApiError('wrong old password', 400);
      }

      const passwords = [...userOldPassword, { password: user.password }];

      await Promise.all(
        passwords.map(async ({ password: hash }) => {
          const isMatched = await passwordService.compare(newPassword, hash);
          if (isMatched) {
            throw new ApiError('Wrong new password', 400);
          }
        }),
      );

      const newPassHash = await passwordService.hash(newPassword);

      await Promise.all([
        OldPassword.create({ password: user.password, _user: _id }),
        User.findByIdAndUpdate(_id, { password: newPassHash }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async forgotPassword(
    email: string,
    _id: string,
    username: string,
    phone: string,
  ): Promise<void> {
    try {
      const forgotPasswordToken = await tokenService.generateActionToken(
        { _id },
        EActionTokenType.Forgot,
      );

      await Promise.all([
        Action.create({
          actionToken: forgotPasswordToken,
          actionType: EActionTokenType.Forgot,
          _user: _id,
        }),

        emailService.sendMail(email, EEmailActions.FORGOT_PASSWORD, {
          forgotPasswordToken,
          username,
        }),

        smsService.sendSMS(phone, ESmsActions.FORGOT_PASSWORD, username),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async setForgotPassword(
    password: string,
    userId: Types.ObjectId,
  ): Promise<void> {
    try {
      const hashPassword = await passwordService.hash(password);

      await Promise.all([
        User.findByIdAndUpdate(userId, { password: hashPassword }),

        Action.deleteMany({
          _user: userId,
          actionType: EActionTokenType.Forgot,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async activate(token: string, userId: Types.ObjectId): Promise<void> {
    try {
      const activateToken = tokenService.checkToken(
        token,
        EActionTokenType.Activate,
      );

      if (!activateToken) {
        throw new ApiError('Token is not provided', 400);
      }

      await Promise.all([
        User.findByIdAndUpdate(userId, { status: EStatus.active }),

        Action.deleteMany({
          _user: userId,
          actionType: EActionTokenType.Activate,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
