import { model, Schema, Types } from 'mongoose';

import { EActionTokenType } from '../enums';
import { User } from './User.model';

const actionSchema = new Schema(
  {
    actionToken: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: EActionTokenType,
    },
    _user: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  { versionKey: false, timestamps: true },
);

export const Action = model('action', actionSchema);
