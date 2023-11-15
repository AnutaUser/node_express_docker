import { IUser } from './user.type';

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export type ITokenPayload = Pick<IUser, 'username' | '_id'>;
export type ICredential = Pick<IUser, 'email' | 'password'>;
