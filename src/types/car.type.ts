import { Document, Types } from 'mongoose';

import { IUser } from './user.type';

export interface ICar extends Document {
  brand?: string;
  year?: number;
  price?: number;
  description?: string;
  photo?: string;
  _user?: Types.ObjectId | IUser | any;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
