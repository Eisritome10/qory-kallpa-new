import { AreaVoluntariado } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsEmail()
  email: string;

  @Matches(/^[0-9+\s-]{6,15}$/, { message: 'El teléfono no tiene un formato válido' })
  phone: string;

  @Matches(/^[0-9A-Za-z]{6,12}$/, { message: 'El DNI/documento no tiene un formato válido' })
  dni: string;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento no es válida' })
  birthDate: Date;

  @IsEnum(AreaVoluntariado, { message: 'El área de voluntariado no es válida' })
  area: AreaVoluntariado;

  @IsString()
  @MinLength(20, { message: 'Cuéntanos un poco más sobre tu motivación (mínimo 20 caracteres)' })
  motivation: string;

  @IsString()
  @MinLength(3)
  availability: string;
}
