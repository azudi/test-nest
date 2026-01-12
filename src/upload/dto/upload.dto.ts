import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class UploadDto {
  static allowedFields = ['folder'];
  // @IsString()
  // @IsNotEmpty()
  // @IsEmail()
  // file: Express.Multer.File;
  @IsString()
  @IsNotEmpty()
  @IsEnum(['product', 'service', 'user', 'document', 'other'], {
    message:
      'Invalid folder. Please choose from product, service, user, document or other',
  })
  folder: 'user' | 'document' | 'other';
}

export class DeleteDto {
  @IsString()
  @IsNotEmpty()
  publicId: string;
}
