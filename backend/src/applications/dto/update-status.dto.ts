import { ApplicationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

const REVIEWABLE_STATUSES = [
  ApplicationStatus.EN_REVISION,
  ApplicationStatus.ACEPTADO,
  ApplicationStatus.RECHAZADO,
] as const;

export class UpdateStatusDto {
  @IsEnum(REVIEWABLE_STATUSES, {
    message: `El estado debe ser uno de: ${REVIEWABLE_STATUSES.join(', ')}`,
  })
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'El feedback debe tener al menos 10 caracteres' })
  feedback?: string;
}
