import { Document } from 'mongoose';

export interface IUser extends Document {
  username?: string;
  age?: number;
  gender?: string;
  email?: string;
  password?: string;
  phone?: string;
  status?: string;
  photo?: string;
  video?: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export type IUserWithoutPass = Omit<IUser, 'password'>;
