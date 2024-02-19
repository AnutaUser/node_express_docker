import { NextFunction, Request, Response } from 'express';

import { photoConfig, videoConfig } from '../configs';
import { ApiError } from '../errors';

class FileMiddleware {
  public isPhotoValid(req: Request, _res: Response, next: NextFunction) {
    try {
      if (!req.files) {
        throw new ApiError('No file to upload', 400);
      }

      if (Array.isArray(req.files.photo)) {
        throw new ApiError('You can upload only one photo', 400);
      }

      const { size, mimetype } = req.files.photo;

      if (size > photoConfig.MAX_SIZE) {
        throw new ApiError('Photo is too big', 400);
      }

      if (!photoConfig.MIMETYPES.includes(mimetype)) {
        throw new ApiError('Photo has invalid format', 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public isVideoValid(req: Request, _res: Response, next: NextFunction) {
    try {
      if (!req.files) {
        throw new ApiError('No file to upload', 400);
      }

      if (Array.isArray(req.files.video)) {
        throw new ApiError('You can upload only one video', 400);
      }

      const { size, mimetype } = req.files.video;

      if (size > videoConfig.MAX_SIZE) {
        throw new ApiError('Video is too big', 400);
      }

      if (!videoConfig.MIMETYPE.includes(mimetype)) {
        throw new ApiError('Video has invalid format', 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const fileMiddleware = new FileMiddleware();
