import path from 'node:path';

import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { UploadedFile } from 'express-fileupload';
import { Types } from 'mongoose';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { configs } from '../configs';
import { EFileType } from '../enums';

class S3Service {
  constructor(
    private client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_KEY,
      },
    }),
  ) {}

  public async uploadFile(
    file: UploadedFile,
    itemType: EFileType,
    itemId: Types.ObjectId | string,
  ): Promise<string> {
    const pathToPhoto = this.passBuilder(file.name, itemType, itemId);

    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Body: file.data,
        Key: pathToPhoto,
        ACL: configs.AWS_S3_ACL as ObjectCannedACL,
        ContentType: file.mimetype,
      }),
    );
    return pathToPhoto;
  }

  public async uploadFileStream(
    file: UploadedFile,
    stream: Readable,
    itemType: EFileType,
    itemId: Types.ObjectId | string,
  ): Promise<string> {
    const pathToVideo = this.passBuilder(file.name, itemType, itemId);

    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Body: stream,
        Key: pathToVideo,
        ACL: configs.AWS_S3_ACL as ObjectCannedACL,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );
    return pathToVideo;
  }

  public async deletedFile(filePath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Key: filePath,
      }),
    );
  }

  private passBuilder(
    fileName: string,
    type: string,
    _id: Types.ObjectId | string,
  ): string {
    return `${type}/${_id}/${v4()}${path.extname(fileName)}`;
  }
}

export const s3Service = new S3Service();
