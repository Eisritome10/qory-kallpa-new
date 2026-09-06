import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const pdfUploadOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_PDF_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      callback(new BadRequestException('Solo se permiten archivos en formato PDF'), false);
      return;
    }
    callback(null, true);
  },
};
