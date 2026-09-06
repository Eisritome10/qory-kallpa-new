import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { pdfUploadOptions } from './pdf-upload.options';
import { StorageService } from './storage.service';

/**
 * Endpoint generico de subida de PDFs a Supabase Storage.
 * Usado por el frontend para subir el CV antes de enviar el formulario de postulacion,
 * y reutilizado internamente por ApplicationsService.
 */
@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-pdf')
  @UseInterceptors(FileInterceptor('file', pdfUploadOptions))
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo PDF');
    }

    const { path, fileName } = await this.storageService.uploadPdf(file, 'uploads');
    const signedUrl = await this.storageService.getSignedUrl(path);

    return { path, fileName, signedUrl };
  }
}
