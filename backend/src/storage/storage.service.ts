import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.bucket = this.configService.get<string>('SUPABASE_CV_BUCKET', 'cv-postulantes');

    if (!url || !serviceRoleKey) {
      throw new Error('Faltan las variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
    }

    this.client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  async uploadPdf(file: Express.Multer.File, folder: string): Promise<{ path: string; fileName: string }> {
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `${folder}/${randomUUID()}-${safeOriginalName}`;

    const { error } = await this.client.storage.from(this.bucket).upload(path, file.buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

    if (error) {
      throw new InternalServerErrorException(`No se pudo subir el archivo a Supabase Storage: ${error.message}`);
    }

    return { path, fileName: file.originalname };
  }

  async getSignedUrl(path: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error || !data) {
      throw new InternalServerErrorException(
        `No se pudo generar la URL firmada del archivo: ${error?.message ?? 'desconocido'}`,
      );
    }

    return data.signedUrl;
  }

  async deleteFile(path: string): Promise<void> {
    await this.client.storage.from(this.bucket).remove([path]);
  }
}
