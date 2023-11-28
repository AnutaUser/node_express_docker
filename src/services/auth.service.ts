import { EEmailActions } from '../enums';
import { ApiError } from '../errors';
import { OldPassword, Token, User } from '../models';
import { ICredential, ITokenPair, ITokenPayload, IUser } from '../types';
import { emailService } from './email.service';
import { passwordService } from './password.service';
import { tokenService } from './token.service';

class AuthService {
  public async register(user: IUser) {
    try {
      const { password, email, username } = user;

      const hashedPassword = await passwordService.hash(password);

      await Promise.all([
        User.create({ ...user, password: hashedPassword }),

        emailService.sendMail(email, EEmailActions.REGISTER, { username }),
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
}

export const authService = new AuthService();
