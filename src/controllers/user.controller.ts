import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import multer from 'multer';

import { ApiError } from '../errors';
import { userMapper } from '../mappers';
import { userService } from '../services';
import { IUser } from '../types';

class UserController {
  public async findAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findAll();

      return res.status(200).json(users);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const userById = await userService.getById(req.params.userId);
      const response = userMapper.userForResponse(userById);

      return res.status(200).json(response);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;
      const user = req.body;

      const updateUser = await userService.update(userId, user);
      const response = userMapper.userForResponse(updateUser);

      return res.status(201).json(response);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await userService.delete(req.params.userId);

      return res.sendStatus(204);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async uploadPhoto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;
      const photo = req.files.photo as UploadedFile;

      const user = await userService.uploadPhoto(photo, userId);

      const response = userMapper.userForResponse(user);

      return res.status(201).json(response);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async deletePhoto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const user = await userService.deletePhoto(userId);
      const response = userMapper.userForResponse(user);

      return res.status(204).json(response);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async uploadVideo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { userId } = req.params;
      const video = req.files.video as UploadedFile;

      const upload = multer().single('');

      upload(req, res, async (err) => {
        if (err) {
          throw new ApiError('Download error', 500);
        }

        const user = await userService.uploadVideo(video, userId);
        const response = userMapper.userForResponse(user);

        return res.status(201).json(response);
      });
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async deleteVideo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const user = await userService.deleteVideo(userId);
      const response = userMapper.userForResponse(user);

      return res.status(204).json(response);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const userController = new UserController();
