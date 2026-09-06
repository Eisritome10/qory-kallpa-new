import { ApplicationStatus, AreaVoluntariado } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterApplicationsDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  /** Solo tiene efecto para DIRECTOR_GENERAL; el resto de directores estan acotados a su area. */
  @IsOptional()
  @IsEnum(AreaVoluntariado)
  area?: AreaVoluntariado;

  @IsOptional()
  @IsString()
  search?: string;
}
