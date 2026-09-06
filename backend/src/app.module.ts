import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { ApplicationsModule } from './applications/applications.module';
import { SusEvaluationModule } from './sus-evaluation/sus-evaluation.module';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StorageModule,
    ApplicationsModule,
    SusEvaluationModule,
    EmailModule,
    HealthModule,
  ],
})
export class AppModule {}
