import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';

export const CloudinaryProvider = {
  provide: 'MULTER_CONFIG',
  useFactory: () => {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {},
    });
    return multer({ storage });
  },
};
