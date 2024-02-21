import { UploadedFile } from 'express-fileupload';
import { createReadStream } from 'streamifier';

import { EFileType, ESmsActions } from '../enums';
import { ApiError } from '../errors';
import { User } from '../models';
import { userRepository } from '../repositories';
import { IUser } from '../types';
import { s3Service } from './s3.service';
import { smsService } from './sms.service';

class UserService {
  public async findAll(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getById(userId: string): Promise<IUser> {
    return await this.getOneByIdOrThrow(userId);
  }

  public async update(userId: string, data: IUser): Promise<IUser> {
    await this.getOneByIdOrThrow(userId);

    return await userRepository.update(userId, data);
  }

  public async delete(userId: string): Promise<void> {
    const user = await this.getOneByIdOrThrow(userId);

    await Promise.all([
      User.findByIdAndDelete(userId),
      smsService.sendSMS(user.phone, ESmsActions.DELETE, user.username),
    ]);
  }

  public async uploadPhoto(
    photo: UploadedFile,
    userId: string,
  ): Promise<IUser> {
    const user = await this.getOneByIdOrThrow(userId);

    if (user.photo) {
      await s3Service.deletedFile(user.photo);
    }

    const pathToPhoto = await s3Service.uploadFile(
      photo,
      EFileType.userPhoto,
      userId,
    );

    return await User.findByIdAndUpdate(
      userId,
      { $set: { photo: pathToPhoto } },
      { new: true },
    );
  }

  public async deletePhoto(userId: string): Promise<IUser> {
    const user = await this.getOneByIdOrThrow(userId);

    if (!user.photo) {
      return user;
    }
    await s3Service.deletedFile(user.photo);

    return await User.findByIdAndUpdate(
      userId,
      { $unset: { photo: true } },
      { new: true },
    );
  }

  public async uploadVideo(
    video: UploadedFile,
    userId: string,
  ): Promise<IUser> {
    await this.getOneByIdOrThrow(userId);

    const stream = createReadStream(video.data);

    const pathToVideo = await s3Service.uploadFileStream(
      video,
      stream,
      EFileType.userVideo,
      userId,
    );

    return await User.findByIdAndUpdate(
      userId,
      { $set: { video: pathToVideo } },
      { new: true },
    );
  }

  public async deleteVideo(userId: string): Promise<IUser> {
    const user = await this.getOneByIdOrThrow(userId);

    if (!user.video) {
      return user;
    }
    await s3Service.deletedFile(user.video);

    return await User.findByIdAndUpdate(
      userId,
      { $unset: { video: true } },
      { new: true },
    );
  }

  private async getOneByIdOrThrow(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 422);
    }
    return user;
  }
}

export const userService = new UserService();
