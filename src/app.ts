import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { configs } from './configs';
import { User } from './models';
import { IUser } from './types';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  '/users',
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  '/users',
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> => {
    try {
      const newUser = await User.create(req.body);

      return res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  },
);

app.get(
  '/users/:userId',
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> => {
    try {
      const userById = await User.findById(req.params.userId);

      return res.status(200).json(userById);
    } catch (e) {
      next(e);
    }
  },
);

app.patch(
  '/users/:userId',
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> => {
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        {
          returnDocument: 'after',
        },
      );

      return res.status(201).json(updateUser);
    } catch (e) {
      next(e);
    }
  },
);

app.delete(
  '/users/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await User.findByIdAndDelete(req.params.userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  },
);

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  // eslint-disable-next-line no-console
  console.log(`work on port: ${configs.PORT} 😎️`);
});
