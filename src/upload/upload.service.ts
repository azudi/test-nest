import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { BadRequestException } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';

const allowed = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];
const MAX_SIZE = 5 * 1024 * 1024; // This is 5MB, smart ass

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
      upload_preset: 'product-name',
    });
  }

  async uploadImage(file: Express.Multer.File, folder?: string): Promise<any> {
    if (!file?.buffer) {
      throw new BadRequestException('File buffer missing');
    }

    // Dynamically import ESM-only file-type
    const { fileTypeFromBuffer } = await import('file-type');
    const detected = await fileTypeFromBuffer(file.buffer);

    if (!detected) {
      throw new BadRequestException('Could not determine file type');
    }

    if (!allowed.includes(detected.mime)) {
      throw new BadRequestException(
        `Unsupported file type:  ${detected.mime}`
      );
    }

    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File too large');
    }

    const response: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: folder }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(file.buffer);
    });

    return {
      name: file.originalname,
      mimetype: file.mimetype,
      resource_type: response.resource_type,
      url: response.url,
      size: file?.size / 1024
    };
  }


  getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const foldername = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return `${foldername}/${publicId}`;
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(this.getPublicIdFromUrl(publicId), (error, result) => {
        console.log(error, result)
        if (error) reject(error);
        else {
          result == "ok" ? resolve({ message: 'Image deleted successfully' }) : resolve({ message: 'Image deleted failed' });
        }
      });
    });
  }

}
