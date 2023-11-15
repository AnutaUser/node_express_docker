import { ApiError } from '../errors';
import { Token, User } from '../models';
import { ICredential, ITokenPair, IUser } from '../types';
import { passwordService } from './password.service';
import { tokenService } from './token.service';

class AuthService {
  public async register(user: IUser) {
    const { password } = user;

    const hashedPassword = await passwordService.hash(password);

    await User.create({ ...user, password: hashedPassword });
  }

  public async login(
    credentials: ICredential,
    user: IUser,
  ): Promise<ITokenPair> {
    const isMatched = await passwordService.compare(
      credentials.password,
      user.password,
    );
    if (!isMatched) {
      throw new ApiError('wrong email or password', 401);
    }

    const tokenPair = await tokenService.generateTokenPair({
      _id: user._id,
      username: user.username,
    });

    await Token.create({ ...tokenPair, _user: user._id });
    return tokenPair;
  }
}

export const authService = new AuthService();
