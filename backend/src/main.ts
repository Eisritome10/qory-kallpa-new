import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // FRONTEND_URL: dominio principal del frontend (ej. https://www.qorikallpa.org o tu URL de Vercel).
  // CORS_EXTRA_ORIGINS: origenes adicionales separados por coma (ej. previews de Vercel).
  const extraOrigins = configService
    .get<string>('CORS_EXTRA_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    configService.get<string>('FRONTEND_URL', ''),
    ...extraOrigins,
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Qori Kallpa API escuchando en el puerto ${port}`);
}

bootstrap();
