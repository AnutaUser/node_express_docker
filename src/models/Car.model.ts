import { model, Schema, Types } from 'mongoose';

import { User } from './User.model';

const carSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    year: {
      type: Number,
      require: true,
      trim: true,
    },
    price: {
      type: Number,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      require: false,
    },
    photo: {
      type: String,
      require: false,
    },
    _user: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Car = model('car', carSchema);
